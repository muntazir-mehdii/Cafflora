const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/discounts/validate
router.post('/validate', async (req, res) => {
    const rawCode = req.body && req.body.code;
    const code = String(rawCode || '').trim();

    if (!code) {
        return res.status(400).json({ error: 'Promo code is required' });
    }

    try {
        const [rows] = await db.query(
            `SELECT code, discount_percent
             FROM discounts
             WHERE code = ? AND is_active = TRUE
             LIMIT 1`,
            [code]
        );

        if (!rows.length) {
            return res.status(400).json({ error: 'Invalid or inactive promo code' });
        }

        const discount = rows[0];
        return res.json({
            valid: true,
            code: discount.code,
            discount_percent: Number(discount.discount_percent) || 0
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to validate promo code' });
    }
});

module.exports = router;
