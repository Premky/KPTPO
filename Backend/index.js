import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectMySQL from 'express-mysql-session';
const MySQLStore = connectMySQL(session);

import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler.js';

import { publicRouter } from './routes/publicRoutes.js';
import { driverRouter } from './routes/driverRoute.js';
import { authRouter } from './routes/authRoute.js';
import { adminRouter } from './routes/adminRoute.js';
import { arrestedVehicleRouter } from './routes/arrestedVehiclesRuoute.js';
import { accidentRoute } from './routes/accidentRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: process.env.jwt_prem_ko_secret_key || 'jwt_prem_ko_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: 'strict',
    }
}));

// Logging (optional)
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('tiny'));
}

app.use(compression());

// Define allowed origins
const hardOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://192.168.1.21:5173',
    'https://kptpo.onrender.com',
    'http://192.168.192.250:8211',
    'http://192.168.165.250:8211',
    'https://kptpo-backend.onrender.com',
];

// CORS setup
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || hardOrigins;
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // ✅ IMPORTANT for session cookies
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
// app.use(limiter); // Optional, enable as needed

// Static files
app.use(express.static('Public'));
app.use('/Uploads', express.static(path.join(__dirname, 'Public', 'Uploads')));

// Routes
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/public', publicRouter);
app.use('/driver', driverRouter);
app.use('/av', arrestedVehicleRouter);
app.use('/accident', accidentRoute);

// Error handler
app.use(errorHandler);

// Server start
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('👋 Server shutting down...');
    process.exit();
});
