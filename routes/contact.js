const express = require('express');
const router = express.Router();
const db = require('../config/db');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact
router.post('/', async (req, res) => {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim();
    const message = String(req.body?.message || '').trim();

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'name, email, and message are required' });
    }
    if (!EMAIL_RE.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    if (name.length > 120 || message.length > 4000) {
        return res.status(400).json({ error: 'Input exceeds allowed length' });
    }

    try {
        await db.query(
            'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
            [name, email, message]
        );
        return res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to submit message' });
    }
});

module.exports = router;

