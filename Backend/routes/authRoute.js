import express from 'express';
import con from '../utils/db.js';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Corrected bcrypt import

const router = express.Router();
const query = promisify(con.query).bind(con);

// Function to hash passwords
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Create User Route
router.post("/create_user", async (req, res) => {
    try {
        const { name_np, username, usertype, password, repassword, office, branch, is_active } = req.body;

        // Check for missing fields
        if (!name_np || !username || !password || !repassword || !office) {
            return res.status(400).json({ message: "सबै फिल्डहरू आवश्यक छन्।" });
        }

        // Check if passwords match
        if (password !== repassword) {
            return res.status(400).json({ message: "पासवर्डहरू मिलेन।" });
        }
        // Check if the username already exists
        const existingUser = await query("SELECT id FROM users WHERE username = ?", [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "यो प्रयोगकर्ता नाम पहिल्यै अवस्थित छ।" });
        }
        
        // Hash the password
        const hashedPassword = await hashPassword(password);
        // Insert user into the database
        const sql = `
            INSERT INTO users (name, username, usertype, password, office_id, branch_id, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        // await query(sql, [name_np, username, usertype, hashedPassword, office, branch, is_active]);

        try {
            const result = await query(sql, [name_np, username, usertype, hashedPassword, office, branch, is_active]);
            return res.json({ Status: true, Result: result })
        } catch (err) {
            console.error("Database Query Error:", err);
            res.status(500).json({ Status: false, Error: "Internal Server Error" })
        }

        // res.status(201).json({ message: "प्रयोगकर्ता सफलतापूर्वक सिर्जना गरियो।" });
    } catch (error) {
        console.error("User creation error:", error);
        res.status(500).json({ message: "सर्भर त्रुटि भयो।" });
    }
});

router.get('/get_users', async (req, res) => {
    const sql = `SELECT 
            u.*, 
            ut.name_en AS en_usertype, 
            o.name_np AS office_name, 
            b.name_np AS branch_name
        FROM 
            users u
        LEFT JOIN 
            usertypes ut ON u.usertype = ut.id
        LEFT JOIN 
            office o ON u.office_id = o.id
        LEFT JOIN 
            branch b ON u.branch_id = b.id
        ORDER BY 
            u.id`;
    try {
        const result = await query(sql);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" })
    }
});

router.put('/update_user/:userid', async (req, res) => {
    const { userid } = req.params;
    const { name_np, username, usertype, password, repassword, office, branch, is_active } = req.body;
    
    
    // Check for missing fields
    if (!name_np || !username || !password || !repassword || !office) {
        return res.status(400).json({ message: "सबै फिल्डहरू आवश्यक छन्।" });
    }

    // Check if passwords match
    if (password !== repassword) {
        return res.status(400).json({ message: "पासवर्डहरू मिलेन।" });
    }
    // Check if the username already exists
    const existingUser = await query("SELECT id FROM users WHERE id = ?", [userid]);
    if (existingUser.length === 0) {
        return res.status(400).json({ message: "यो प्रयोगकर्ता अवस्थित छैन।" });
    }
    
    console.log('username:', userid)    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    const sql = `
        UPDATE users SET name=?, username=?, usertype=?, password=?, office_id=?, branch_id=?, is_active=? WHERE username=?`;
    try {
        const result = await query(sql, [name_np, username, usertype, hashedPassword, office, branch, is_active, userid]);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" })
    }
});

router.delete('/delete_user/:id', async (req, res) => {
    const { id } = req.params;
    console.log('id',id)
    // Validate the ID to ensure it's a valid format (e.g., an integer)
    if (!Number.isInteger(parseInt(id))) {
        return res.status(400).json({ Status: false, Error: 'Invalid ID format' });
    }

    try {
        const sql = "DELETE FROM users WHERE id = ?";
        // const result = await query(sql, [id]);
        // console.log(result)
        con.query(sql, id, (err, result) => {
            if (err) {
                console.error('Database query error:', err); // Log the error for internal debugging
                return res.status(500).json({ Status: false, Error: 'Internal server error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ Status: false, Error: 'Record not found' });
            }

            return res.status(200).json({ Status: true, Result: result });
        });
    } catch (error) {
        console.error('Unexpected error:', error); // Log unexpected errors for internal debugging
        return res.status(500).json({ Status: false, Error: 'Unexpected error occurred' });
    }
});


const validateLoginInput = (username, password) => {
    if (!username || !password) {
        return { isValid: false, message: "Username and Password are required." };
    }
    return { isValid: true }
}

const fetchUserQuery = `
    SELECT DISTINCT u.*, ut.name_np AS role_np, ut.name_en AS role_en,
                    o.name_np AS office_np, o.name_en AS office_en,                     
                    o.id AS office_id, b.name_np AS branch_name
    FROM users u
            LEFT JOIN usertypes ut ON u.usertype = ut.id
            LEFT JOIN office o ON u.office_id = o.id    
            LEFT JOIN branch b ON u.branch_id = b.id
    WHERE u.username = ?;
`;

const fetchUserAppsQuery = `
    SELECT a.id AS app_id, a.name_np AS app_name_np, a.name_en AS app_name_en, a.short_name AS app_short_name
    FROM apps a
            LEFT JOIN user_apps ua ON a.id = ua.app_id
    WHERE ua.user_id = ?;
`;

// Route to login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    const validation = validateLoginInput(username, password);
    if (!validation.isValid) {
        return res.status(400).json({ loginStatus: false, Error: validation.message });
    }

    try {
        // Query database for user
        con.query(fetchUserQuery, [username], async (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ loginStatus: false, Error: "Database error" });
            }

            if (result.length === 0) {
                return res.status(401).json({ loginStatus: false, Error: "Invalid username or password" });
            }

            const user = result[0];

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ loginStatus: false, Error: "Invalid username or password" });
            }

            // Fetch the user's allowed apps
            con.query(fetchUserAppsQuery, [user.id], (err, appsResult) => {
                if (err) {
                    console.error("Error fetching apps:", err);
                    return res.status(500).json({ loginStatus: false, Error: "Error fetching apps" });
                }

                // Extract allowed apps
                const allowedApps = appsResult.map(app => ({
                    app_id: app.app_id,
                    app_name_np: app.app_name_np,
                    app_name_en: app.app_name_en,
                    app_short_name: app.app_short_name
                }));
                // console.log("Allowed Apps:", allowedApps);

                // Prepare user details
                const userdetails = {
                    id: user.id,
                    username: user.username,
                    usertype: user.usertype,
                    office_id: user.office_id,
                    branch_id: user.branch_id,
                    is_active: user.is_active,
                    role_np: user.role_np,
                    role_en: user.role_en,
                    office_np: user.office_np,
                    office_en: user.office_en,
                    branch_name: user.branch_name,
                    allowed_apps: allowedApps, // Include allowed apps in the response
                };

                // Generate JWT token
                const token = jwt.sign(userdetails, process.env.JWT_SECRET, {expiresIn: '1d'});

                // Set token in HTTP-only cookie
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Lax',
                    path: '/',
                    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
                });

                req.session.user={userdetails};

                // Send user details along with allowed apps (without token)
                return res.json({
                    loginStatus: true,
                    userdetails: userdetails,
                });
            });

        });

    } catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({ loginStatus: false, Error: "Server error" });
    }
});


router.post('/logout', (req, res) => {
    console.log('Logging out');
    try {
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Lax' });
        return res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Logout failed' });
    }
});

router.get('/session', (req, res) => {
    const token = req.cookies.token;
    // console.log("Session:", token)
    if (!token) {
        return res.status(401).json({ success: false, message: 'No active session' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({
            success: true,
            token,
            user: decoded.username,
            role: decoded.role_en,
            office_id: decoded.office_id,
            office_np: decoded.office_np,
            branch_np: decoded.branch_name,
            main_office_id: decoded.main_office_id,
            allowed_apps: decoded.allowed_apps,
        });  // Send the decoded token data as response to AuthProvider(AuthContext.jsx)
        
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid session' });
    }
});

router.get('/health', (req, res) => {
    res.status(200).send("OK");
});

export { router as authRouter };
