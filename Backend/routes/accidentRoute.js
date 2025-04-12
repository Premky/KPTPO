import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import { promisify } from 'util';
import verifyToken from '../middlewares/verifyToken.js';
import con from '../utils/db.js';

dotenv.config();

// Promisify specific methods
const queryAsync = promisify(con.query).bind(con);
const beginTransactionAsync = promisify(con.beginTransaction).bind(con);
const commitAsync = promisify(con.commit).bind(con);
const rollbackAsync = promisify(con.rollback).bind(con);
const query = promisify(con.query).bind(con);

const router = express.Router();

router.post("/create_accident", verifyToken, async (req, res) => {
    const { username, office_id } = req.user;

    const {
        date, state_id, district_id, municipality_id, ward, road_name,
        accident_location, accident_time, death_male, death_female, death_other,
        gambhir_male, gambhir_female, gambhir_other,
        general_male, general_female, general_other,
        animal_death, remarks, animal_injured
    } = req.body;

    const accidentRecord = [
        date, state_id, district_id, municipality_id, ward, road_name,
        accident_location, accident_time, death_male, death_female, death_other,
        gambhir_male, gambhir_female, gambhir_other,
        general_male, general_female, general_other,
        animal_death, animal_injured, remarks, office_id, username
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
                animal_death, animal_injured, remarks, office_id, created_by
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
    const sql = `SELECT 
            ar.*, 
            d.name_en AS district_en, 
            d.name_np AS district_np,
            s.name_np AS state_np,
            m.name_np AS municipality_np,

            -- Vehicle info as array of JSON objects
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', v.id,
                        'name_np', v.name_np,
                        'name_en', v.name_en
                    )
                )
                FROM accident_vehicles av
                JOIN vehicles v ON av.vehicle_id = v.id
                WHERE av.accident_id = ar.id
            ) AS vehicles,

            (ar.death_male + ar.death_female + ar.death_other) AS fatalities,
            (ar.gambhir_male + ar.gambhir_female + ar.gambhir_other) AS gambhir,
            (ar.general_male + ar.general_female + ar.general_other) AS general,
            (ar.animal_death + ar.animal_injured) AS animal,
            (
                (ar.gambhir_male + ar.gambhir_female + ar.gambhir_other) + 
                (ar.general_male + ar.general_female + ar.general_other)
            ) AS casualties

        FROM accident_records ar
        LEFT JOIN accident_record_reasons arr ON ar.id = arr.accident_id
        LEFT JOIN np_districts d ON ar.district_id = d.id
        LEFT JOIN np_states s ON ar.state_id = s.id
        LEFT JOIN np_municipalities m ON ar.municipality_id = m.id

        GROUP BY ar.id;



                `;
    try {
        const result = await query(sql);
        return res.json({ Status: true, Result: result, message: 'Records fetched successfully.' })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" })
    }
});

export { router as accidentRoute };
