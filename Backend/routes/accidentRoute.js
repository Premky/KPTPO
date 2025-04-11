import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import { promisify } from 'util';
import verifyToken from '../middlewares/verifyToken.js';

dotenv.config();

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    ...(process.env.DB_PORT && { port: process.env.DB_PORT }),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ...(process.env.SSL && {
        ssl: {
            rejectUnauthorized: false,
        }
    })
});

// Promisify specific methods
const queryAsync = promisify(con.query).bind(con);
const beginTransactionAsync = promisify(con.beginTransaction).bind(con);
const commitAsync = promisify(con.commit).bind(con);
const rollbackAsync = promisify(con.rollback).bind(con);

const router = express.Router();

router.post("/create_accident", verifyToken, async (req, res) => {
    const { username, office_id } = req.user;

    const {
        date, state_id, district_id, municipality_id, ward, road_name,
        accident_location, accident_time, death_male, death_female, death_other,
        gambhir_male, gambhir_female, gambhir_other,
        general_male, general_female, general_other,
        animal_death, animal_injured
    } = req.body;

    const accidentRecord = [
        date, state_id, district_id, municipality_id, ward, road_name,
        accident_location, accident_time, death_male, death_female, death_other,
        gambhir_male, gambhir_female, gambhir_other,
        general_male, general_female, general_other,
        animal_death, animal_injured, office_id, username
    ];

    try {
        await beginTransactionAsync();

        // 1. Insert into accident_records
        const insertAccidentSQL = `
            INSERT INTO accident_records (
                date, state_id, district_id, municipality_id, ward, road_name,
                accident_location, accident_time, death_male, death_female, death_other,
                gambhir_male, gambhir_female, gambhir_other,
                general_male, general_female, general_other,
                animal_death, animal_injured, office_id, created_by
            ) VALUES (?)`;

        const accidentResult = await queryAsync(insertAccidentSQL, [accidentRecord]);
        const accident_id = accidentResult.insertId;

        // 2. Insert accident reasons
        const reasonEntries = Object.entries(req.body).filter(([key]) =>
            key.startsWith("accident_type_")
        );
        
        console.log("Filtered Entries:", reasonEntries);

        if (reasonEntries.length === 0) {
            console.log("No matching accident types found.");
        } else {
            for (const [key, reason_id] of reasonEntries) {
                const accident_type_id = parseInt(key.split('_')[2], 10);
                const insertReasonSQL = `
                    INSERT INTO accident_record_reasons (
                        accident_id, accident_type_id, accident_reason_id
                    ) VALUES (?, ?, ?)`;
                await queryAsync(insertReasonSQL, [accident_id, accident_type_id, reason_id]);
            }
        }

        // 3. Insert involved vehicles
        const vehicleEntries = Object.entries(req.body).filter(([key]) =>
            key.startsWith("vehicle_name_")
        );

        for (const [key, vehicle_id] of vehicleEntries) {
            const vehicleIndex = key.split('_')[2];
            const remarkKey = `vehicle_remark_${vehicleIndex}`;
            const vehicle_remark = req.body[remarkKey] || "";

            const insertVehicleSQL = `
                INSERT INTO accident_vehicles (
                    accident_id, vehicle_id, vehicle_role
                ) VALUES (?, ?, ?)`;
            await queryAsync(insertVehicleSQL, [accident_id, vehicle_id, vehicle_remark]);
        }

        await commitAsync(); // Commit the transaction

        return res.json({
            Status: true,
            message: "दुर्घटना विवरण सफलतापूर्वक सुरक्षित गरियो।"
        });

    } catch (error) {
        await rollbackAsync(); // Rollback the transaction if error occurs

        console.error("Transaction failed:", error);
        return res.status(500).json({
            Status: false,
            Error: error.message,
            message: "सर्भर त्रुटि भयो, सबै डाटा पूर्वस्थितिमा फर्काइयो।"
        });
    }
});

// Route to get accident records
router.get('/get_accident_records', verifyToken, async (req, res) => {
    const { username } = req.user;  // Extracting username from JWT token
    // console.log("Username:", req.user);

    // SQL query to fetch accident records
    const sql = `SELECT * FROM accident_records`;

    try {
        // Destructure the rows from the result
        const rows = await con.execute(sql);
        console.log(rows)
        // Return the results in JSON format
        return res.json({ Status: true, Result: rows });
    } catch (err) {
        console.error("Database Query Error:", err);
        return res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});

export { router as accidentRoute };
