import express from 'express';
import con from '../utils/db.js';
import { promisify } from 'util';
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
            const result = await query(sql,[name_np, username, usertype, hashedPassword, office, branch, is_active]);
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
        u.id;
`;
    try {
        const result = await query(sql);
        return res.json({ Status: true, Result: result })
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ Status: false, Error: "Internal Server Error" })
    }
});

router.delete('/delete_user/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    // Validate the ID to ensure it's a valid format (e.g., an integer)
    if (!Number.isInteger(parseInt(id))) {
        return res.status(400).json({ Status: false, Error: 'Invalid ID format' });
    }

    try {
        const sql = "DELETE FROM users WHERE id = ?";
        con.query(sql, [id], (err, result) => {
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

export { router as authRouter };
