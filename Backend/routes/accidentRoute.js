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
        accident_location, accident_time, death_male, death_female, death_boy, death_girl, death_other,
        gambhir_male, gambhir_female, gambhir_boy, gambhir_girl, gambhir_other,
        general_male, general_female, general_boy, general_girl, general_other,
        animal_death, animal_injured, remarks
    } = req.body;

    const accidentRecord = [
        date, state_id, district_id, municipality_id, ward, road_name,
        accident_location, accident_time, death_male, death_female, death_boy, death_girl, death_other,
        gambhir_male, gambhir_female, gambhir_boy, gambhir_girl, gambhir_other,
        general_male, general_female, general_boy, general_girl, general_other,
        animal_death, animal_injured, remarks, office_id, username
    ];

    try {
        await beginTransactionAsync();

        // 1. Insert into accident_records
        const insertAccidentSQL = `
            INSERT INTO accident_records (
                date, state_id, district_id, municipality_id, ward, road_name,
                accident_location, accident_time, death_male, death_female, death_boy, death_girl, death_other,
                gambhir_male, gambhir_female, gambhir_boy, gambhir_girl, gambhir_other,
                general_male, general_female, general_boy, general_girl, general_other,
                animal_death, animal_injured, remarks, office_id, created_by
            ) VALUES (?)`;

        const accidentResult = await queryAsync(insertAccidentSQL, [accidentRecord]);
        const accident_id = accidentResult.insertId;

        // 2. Insert accident reasons
        const reasonEntries = Object.entries(req.body).filter(([key]) =>
            key.startsWith("accident_type_")
        );

        // console.log("Filtered Entries:", reasonEntries);

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
            const categoryKey = `vehicle_category_${vehicleIndex}`;
            const vehicle_category = req.body[categoryKey] || "";
            const countryKey = `vehicle_country_${vehicleIndex}`;
            const vehicle_country = req.body[countryKey] || "";
            const remarkKey = `vehicle_remark_${vehicleIndex}`;
            const vehicle_remark = req.body[remarkKey] || "";

            const insertVehicleSQL = `
                INSERT INTO accident_vehicles (
                    accident_id, vehicle_id, category_id, country_id, vehicle_role
                ) VALUES (?, ?, ?,?, ?)`;
            await queryAsync(insertVehicleSQL, [accident_id, vehicle_id, vehicle_category, vehicle_country, vehicle_remark]);
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
router.get('/get_accident_records१', verifyToken, async (req, res) => {
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

            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', ars.id,
                        'name_np', ars.name_np,
                        'name_en', ars.name_en
                    )
                )
                FROM accident_record_reasons arr
                JOIN accident_reasons ars ON arr.accident_id = ars.id                
                WHERE arr.accident_id = ar.id
            ) AS reasons,

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

        GROUP BY ar.id`;
    try {
        const result = await query(sql);
        return res.json({ Status: true, Result: result, message: 'Records fetched successfully.' })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" })
    }
});

router.get('/get_accident_records2', verifyToken, async (req, res) => {
    try {
        //setp 1: fetch all reason type
        const reasonTypes = await query('SELECT id, name_en, name_np FROM accident_reason_type');


        //step 2: Fetch all accidents
        const accidents = await query(`SELECT 
                                        ar.*, 
                                        ns.name_np AS state_np, 
                                        nd.name_np AS district_np, 
                                        nm.name_np AS municipality_np
                                    FROM accident_records ar
                                    LEFT JOIN np_states ns ON ns.id = ar.state_id
                                    LEFT JOIN np_districts nd ON nd.id = ar.district_id
                                    LEFT JOIN np_municipalities nm ON nm.id = ar.municipality_id
                        `);

        // console.log(accidents)

        const accidentData = [];
        for (const acc of accidents) {
            const accidentId = acc.id;
            //step 3: Fetch vehicles for this accident
            const vehicles = await query(`SELECT v.name_np FROM accident_vehicles av
                                            JOIN vehicles v ON v.id = av.vehicle_id
                                            WHERE av.accident_id = ?`, [accidentId]);

            //Step 4: Fetch reasons with reason type
            const reasons = await query(`SELECT r.name_np AS reason, rt.name_np AS reason_type 
                                        FROM accident_record_reasons arr
                                        JOIN accident_reasons r ON r.id = arr.accident_reason_id
                                        JOIN accident_reason_type rt ON rt.id=r.reason_type                                        
                                        WHERE arr.accident_id=?`, [accidentId]);

            //Step 5: Group reasons by reason_type
            const reasonMap = {};
            reasonTypes.forEach(rt => {
                reasonMap[rt.name_np] = []; //empty by default
            });

            reasons.forEach(r => {
                reasonMap[r.reason_type]?.push(r.reason);
            });

            //Step 6: Prepare row
            const row = {
                accident_id: accidentId,
                accident_date: acc.date,
                state_np: acc.state_np,
                district_np: acc.district_np,
                municipality_np: acc.municipality_np,
                // vehicles: vehicles.map(v => v.name_np).join(','),                
            };

            //Add reasons
            reasonTypes.forEach(rt => {
                row[rt.name_np] = reasonMap[rt.name_np].join(',');
            });

            accidentData.push(row);
        }
        // console.log(accidentData)

        res.json({
            Status: true, data: accidents,
            reasonTypes: reasonTypes.map(rt => rt.name_np),
            message: 'Records fetched successfully.'
        });
    } catch (error) {
        console.log('Error fetching accident table data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/get_accident_records2', verifyToken, async (req, res) => {
    try {
        //setp 1: fetch all reason type
        const reasonTypes = await query('SELECT id, name_en, name_np FROM accident_reason_type');

        const records = await query(`
            SELECT 
              vr.date,
              vr.time,
              CONCAT(c.name, ', ', d.name, ', ', s.name) AS location,
              vat.name AS accident_type,
              va.name AS accident_name,
              v.name AS vehicle_name,
              COUNT(*) AS count
            FROM vehicle_records vr
            JOIN vehicle_accident va ON va.id = vr.accident_id
            JOIN vehicle_accident_types vat ON vat.id = va.accident_type_id
            JOIN accident_vehicles av ON av.accident_id = va.id
            JOIN vehicles v ON v.id = av.vehicle_id
            JOIN np_cities c ON c.id = vr.city_id
            JOIN np_districts d ON d.id = vr.district_id
            JOIN np_states s ON s.id = vr.state_id
            GROUP BY vr.date, vr.time, location, vat.name, va.name, v.name
            ORDER BY vr.date DESC
          `);



        // console.log(accidentData)
    
        res.json({
            Status: true, data: accidents,
            reasonTypes: reasonTypes.map(rt => rt.name_np),
            message: 'Records fetched successfully.'
        });
    } catch (error) {
        console.log('Error fetching accident table data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get("/get_accident_records", async (req, res) => {
    try {
        // Main data
        //   ar.date,
        //   ar.accident_time,        
        const records = await query(`
                SELECT 
                ar.date,
                c.name_np AS municipality,
                d.name_np AS district,
                s.name_np AS state,
                ar.ward,
                ar.road_name,
                ar.accident_location,
                ar.accident_time,
                ar.death_male,  ar.death_female, ar.death_boy, ar.death_girl, ar.death_other,
                SUM(ar.death_male + ar.death_female + ar.death_boy + ar.death_girl + ar.death_other) AS total_death,
                
                ar.gambhir_male,  ar.gambhir_female, ar.gambhir_boy, ar.gambhir_girl, ar.gambhir_other,
                SUM(ar.gambhir_male + ar.gambhir_female + ar.gambhir_boy + ar.gambhir_girl + ar.gambhir_other) AS total_gambhir,                
                
                ar.general_male,  ar.general_female, ar.gambhir_boy, ar.gambhir_girl, ar.gambhir_other,
                SUM(ar.general_male + ar.general_female + ar.general_boy + ar.general_girl + ar.general_other) AS total_general,

                ar.animal_death, ar.animal_injured,
                ar.remarks,
                ar.office_id,  ar.created_by,  ar.updated_by,
                CONCAT(c.name_np, ', ', d.name_np, ', ', s.name_np) AS location,
                art.name_np AS accident_type,
                arsn.name_np AS accident_reason,
                v.name_np AS vehicle_name,
                COUNT(*) AS count
                FROM accident_records ar
                JOIN accident_record_reasons arr ON arr.accident_id = ar.id
                JOIN accident_reasons arsn ON arsn.id = arr.accident_reason_id
                JOIN accident_reason_type art ON art.id = arsn.reason_type
                JOIN accident_vehicles av ON av.accident_id = ar.id
                JOIN vehicles v ON v.id = av.vehicle_id
                JOIN np_municipalities c ON c.id = ar.municipality_id
                JOIN np_districts d ON d.id = ar.district_id
                JOIN np_states s ON s.id = ar.state_id
                GROUP BY 
                ar.date,
                ar.accident_time,
                location,
                art.name_np,
                arsn.name_np,
                v.name_np,
                municipality,
                district,
                state,
                ar.ward,
                ar.road_name,
                ar.accident_location,
                ar.death_male,  ar.death_female, ar.death_boy, ar.death_girl, ar.death_other,
                ar.gambhir_male,  ar.gambhir_female, ar.gambhir_boy, ar.gambhir_girl, ar.gambhir_other,
                ar.general_male,  ar.general_female, ar.gambhir_boy, ar.gambhir_girl, ar.gambhir_other,
                ar.animal_death, ar.animal_injured,
                ar.remarks,
                ar.office_id,  ar.created_by,  ar.updated_by

                ORDER BY ar.date DESC`);
        // All vehicles
        const vehicles = await query(`SELECT name_np FROM vehicles`);

        // All accident types and reasons
        const typesAndReasons = await query(`
        SELECT art.name_np AS accident_type, arsn.name_np AS accident_reason
        FROM accident_reason_type art
        JOIN accident_reasons arsn ON arsn.reason_type = art.id
      `);
        // console.log('records:', records)
        // console.log('types:', typesAndReasons)
        res.json({
            Status: true,
            message: "Records fetched successfully.",
            records,
            vehicles: vehicles.map(v => v.name_np),
            typesAndReasons,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});


export { router as accidentRoute };
