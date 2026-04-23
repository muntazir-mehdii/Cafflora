const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// ─── 1. SIGN UP (Register) Route ─────────────────────────────
router.post('/register', async (req, res) => {
    const { full_name, email, password, phone } = req.body;

    try {
        // Check if user already exists
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash the password (Security step)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into database
        const [result] = await db.query(
            'INSERT INTO users (full_name, email, password_hash, phone) VALUES (?, ?, ?, ?)',
            [full_name, email, hashedPassword, phone || null]
        );

        res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// ─── 2. SIGN IN (Login) Route ────────────────────────────────
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = users[0];

        // Compare entered password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT Token (The digital ID card)
        const token = jwt.sign(
            { id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expires in 1 day
        );

        res.json({
            message: 'Login successful',
            token: token,
            user: { id: user.user_id, full_name: user.full_name, email: user.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

module.exports = router;