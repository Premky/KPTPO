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

const router = express.Router();
const query = promisify(con.query).bind(con);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import NepaliDateConverter from 'nepali-date-converter';
const current_date = new NepaliDate().format('YYYY-MM-DD');
const fy = new NepaliDate().format('YYYY'); //Support for filter
const fy_date = fy + '-04-01'
// console.log(current_date);


router.post('/add_driver', async(req, res)=>{
    console.log('working')
    const {
        vehicledistrict, vehicle_name, vehicle_no, start_route, end_route, drivername, driverdob, 
        driverdob_ad, country, state, district, municipality, driverward, driverfather, lisence_no,
        lisencecategory, driverctz_no, ctz_iss, mentalhealth, drivereye, driverear, drivermedicine, driverphoto, 
        remarks
    }=req.body;
    console.log(start_route)
});


export {router as driverRouter}