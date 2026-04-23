const express = require('express');
const router = express.Router();
const db = require('../config/db');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/subscribe
router.post('/', async (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();

    if (!email) {
        return res.status(400).json({ error: 'email is required' });
    }
    if (!EMAIL_RE.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    if (email.length > 190) {
        return res.status(400).json({ error: 'Email is too long' });
    }

    try {
        // subscribers.email is UNIQUE; INSERT IGNORE prevents duplicate errors.
        const [result] = await db.query(
            'INSERT IGNORE INTO subscribers (email) VALUES (?)',
            [email]
        );

        return res.status(201).json({
            success: true,
            subscribed: result.affectedRows === 1
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to subscribe' });
    }
});

module.exports = router;

