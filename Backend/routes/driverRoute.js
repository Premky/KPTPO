import express from 'express';
import con from '../utils/db.js';
import con2 from '../utils/db2.js';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import NepaliDate from 'nepali-datetime';

import verifyToken from '../middlewares/verifyToken.js';
// import upload from '../middlewares/upload.js';

const router = express.Router();
const query = promisify(con.query).bind(con);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import NepaliDateConverter from 'nepali-date-converter';

const current_date = new NepaliDate().format('YYYY-MM-DD');
const fy = new NepaliDate().format('YYYY'); //Support for filter
const fy_date = fy + '-04-01'
// console.log(current_date);

//image upload (Logic)
const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadDir = 'public/Uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now();
        const sanitizedFilename = sanitizeFilename(file.originalname);
        callback(null, `${uniqueSuffix}_${sanitizedFilename}`);
    }
});

const upload = multer({ storage: storage });

//end image upload

function converttoad(bsdate) {
    try {
        const dobAD = NepaliDateConverter.parse(bsdate);
        const ad = dobAD.getAD();
        // console.log('DOB_AD', ad);
        // Accessing year, month, and day using methods
        const year = ad.year;
        const month = ad.month + 1;
        const date = ad.date;
        const day = ad.day + 1;
        const formattedDobAD = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
        // console.log('Formatted DOB_AD:', formattedDobAD);
        return formattedDobAD;
    }
    catch (err) {
        console.error(err);
    }
}

router.post("/add_driver", upload.single("image"), async (req, res) => {
    try {
        const {
            vehicledistrict, drivername, driverdob, vehicle_no, vehicle_name, state, district,
            municipality, driverward, country, driverfather, lisence_no, lisencecategory, driverctz_no,
            ctz_iss, mentalhealth, drivereye, driverear, drivermedicine, start_route, end_route, remarks,
        } = req.body;
        const dobad = converttoad(driverdob)
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
        const created_by = '0'
        const sql = `
            INSERT INTO tango_driver 
            (vehicledistrict, drivername, driverdob, driverdob_ad, vehicle_no, vehicle_name, state, district, municipality, 
            driverward, country, driverfather, lisence_no, lisencecategory, driverctz_no, ctz_iss, mentalhealth, 
            drivereye, driverear,drivermedicine, start_route, end_route,remarks, driverphoto, created_by) 
            VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            vehicledistrict, drivername, driverdob, dobad, vehicle_no, vehicle_name, state, district, municipality,
            driverward, country, driverfather, lisence_no, lisencecategory, driverctz_no, ctz_iss, mentalhealth,
            drivereye, driverear, drivermedicine, start_route, end_route, remarks, imagePath, created_by
        ];

        await query(sql, values);

        res.json({ Status: true, message: "Driver added successfully" });
    } catch (error) {
        console.error("Error adding driver:", error);
        res.status(500).json({ Status: false, message: "Database error", error });
    }
});

router.get("/get_drivers", async (req, res) => {
    const sql = `SELECT 
                td.id,
                td.vehicle_no, td.start_route, td.end_route, td.drivername, td.driverdob, 
                td.driverward, td.driverfather, td.lisence_no, td.driverctz_no, td.mentalhealth, 
                td.drivereye, td.driverear, td.drivermedicine, td.driverphoto, td.remarks,
                nd1.name_np AS vehicledistrict, v.name_np AS vehicle_name, nc.name_np AS country, 
                ns.name_np AS state, nd2.name_np AS district, nm.name_np AS municipality, 
                lc.name_en AS lisencecategory, nd3.name_np AS ctz_iss, u.name AS created_by
            FROM 
                tango_driver td
            LEFT JOIN np_districts nd1 ON td.vehicledistrict = nd1.id
            LEFT JOIN vehicles v ON td.vehicle_name = v.id
            LEFT JOIN np_country nc ON td.country = nc.id
            LEFT JOIN np_states ns ON td.state = ns.id
            LEFT JOIN np_districts nd2 ON td.district = nd2.id
            LEFT JOIN np_municipalities nm ON td.municipality = nm.id
            LEFT JOIN lisence_category lc ON td.lisencecategory = lc.id
            LEFT JOIN np_districts nd3 ON td.ctz_iss = nd3.id
            LEFT JOIN users u ON td.created_by = u.id;          
                `;
    try {
        const result = await query(sql);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" })
    }
});

router.put("/update_driver/:id", upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            drivername, driverdob, vehicle_no, vehicle_name, state, district,
            municipality, country, driverfather, lisence_no, lisencecategory, driverctz_no,
            ctz_iss, mentalhealth, drivereye, driverear, start_route, end_route
        } = req.body;

        let imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        // Fetch existing image path
        const existingDriver = await query(`SELECT image FROM drivers WHERE id = ?`, [id]);

        if (!existingDriver.length) {
            return res.status(404).json({ Status: false, message: "Driver not found" });
        }

        let oldImagePath = existingDriver[0].image;

        let sql = `
            UPDATE drivers SET
            drivername = ?, driverdob = ?, vehicle_no = ?, vehicle_name = ?, 
            state = ?, district = ?, municipality = ?, country = ?, driverfather = ?, 
            lisence_no = ?, lisencecategory = ?, driverctz_no = ?, ctz_iss = ?, 
            mentalhealth = ?, drivereye = ?, driverear = ?, start_route = ?, end_route = ?
        `;

        let values = [
            drivername, driverdob, vehicle_no, vehicle_name, state, district, municipality, country,
            driverfather, lisence_no, lisencecategory, driverctz_no, ctz_iss, mentalhealth, drivereye, driverear,
            start_route, end_route
        ];

        // If a new image is uploaded, update the image field
        if (imagePath) {
            sql += ", image = ?";
            values.push(imagePath);

            // Delete old image if it exists
            if (oldImagePath) {
                const oldImageFullPath = path.join(__dirname, "..", "public", oldImagePath);
                if (fs.existsSync(oldImageFullPath)) {
                    fs.unlinkSync(oldImageFullPath);
                }
            }
        }

        sql += " WHERE id = ?";
        values.push(id);

        await query(sql, values);

        res.json({ Status: true, message: "Driver updated successfully" });
    } catch (error) {
        console.error("Error updating driver:", error);
        res.status(500).json({ Status: false, message: "Database error", error });
    }
});



export { router as driverRouter }