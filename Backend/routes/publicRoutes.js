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


router.get('/get_countries', async(req, res)=>{
    const sql = `SELECT * from np_country ORDER BY name_np`; 
    try{
        const result = await query(sql);
        return res.json({Status:true, Result:result})
    } catch(err){
        console.error("Database Query Error:", err);
        res.status(500).json({Status:false, Error:"Internal Server Error"})
    }
});

router.get('/get_states', async(req, res)=>{
    const sql = `SELECT * from np_states ORDER BY name_np`; 
    try{
        const result = await query(sql);
        return res.json({Status:true, Result:result})
    } catch(err){
        console.error("Database Query Error:", err);
        res.status(500).json({Status:false, Error:"Internal Server Error"})
    }
});

router.get('/get_districts', async(req, res)=>{
    const sql = `SELECT * from np_districts ORDER BY name_np`; 
    try{
        const result = await query(sql);
        return res.json({Status:true, Result:result})
    } catch(err){
        console.error("Database Query Error:", err);
        res.status(500).json({Status:false, Error:"Internal Server Error"})
    }
});

router.get('/get_vehicles', async(req, res)=>{
    const sql = `SELECT * from vehicles ORDER BY name_np`; 
    try{
        const result = await query(sql);
        return res.json({Status:true, Result:result})
    } catch(err){
        console.error("Database Query Error:", err);
        res.status(500).json({Status:false, Error:"Internal Server Error"})
    }
});

router.get('/get_lisence_category', async(req, res)=>{
    const sql = `SELECT * from lisence_category ORDER BY name_en`; 
    try{
        const result = await query(sql);
        return res.json({Status:true, Result:result})
    } catch(err){
        console.error("Database Query Error:", err);
        res.status(500).json({Status:false, Error:"Internal Server Error"})
    }
});

router.get('/get_usertypes', async(req, res)=>{
    const sql = `SELECT * from usertypes ORDER BY id`; 
    try{
        const result = await query(sql);
        return res.json({Status:true, Result:result})
    } catch(err){
        console.error("Database Query Error:", err);
        res.status(500).json({Status:false, Error:"Internal Server Error"})
    }
});
export {router as publicRouter}