const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/db');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (!token) {
        return res.status(401).json({ error: 'Authorization token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// POST /api/cart/add
router.post('/add', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;
    const qtyToAdd = Number(quantity) || 1;

    if (!product_id || qtyToAdd < 1) {
        return res.status(400).json({ error: 'product_id and valid quantity are required' });
    }

    try {
        const [existing] = await db.query(
            'SELECT cart_id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, product_id]
        );

        if (existing.length > 0) {
            await db.query(
                'UPDATE cart SET quantity = quantity + ? WHERE cart_id = ?',
                [qtyToAdd, existing[0].cart_id]
            );
        } else {
            await db.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, product_id, qtyToAdd]
            );
        }

        const [countRows] = await db.query(
            'SELECT COALESCE(SUM(quantity), 0) AS cart_count FROM cart WHERE user_id = ?',
            [userId]
        );

        res.status(200).json({
            message: 'Item added to cart',
            cartCount: countRows[0].cart_count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
});

// GET /api/cart
router.get('/', authenticateJWT, async (req, res) => {
    const userId = req.user.id;

    try {
        const [items] = await db.query(
            `SELECT
                c.cart_id,
                c.product_id,
                c.quantity,
                p.name,
                p.price,
                p.image_url,
                (c.quantity * p.price) AS line_total
             FROM cart c
             JOIN products p ON p.product_id = c.product_id
             WHERE c.user_id = ?
             ORDER BY c.cart_id DESC`,
            [userId]
        );

        const [summaryRows] = await db.query(
            `SELECT
                COALESCE(SUM(c.quantity), 0) AS total_items,
                COALESCE(SUM(c.quantity * p.price), 0) AS subtotal
             FROM cart c
             JOIN products p ON p.product_id = c.product_id
             WHERE c.user_id = ?`,
            [userId]
        );

        res.json({
            items,
            summary: summaryRows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// DELETE /api/cart/:cartId
router.delete('/:cartId', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const cartId = Number(req.params.cartId);

    if (!Number.isInteger(cartId) || cartId < 1) {
        return res.status(400).json({ error: 'Valid cartId is required' });
    }

    try {
        const [result] = await db.query(
            'DELETE FROM cart WHERE cart_id = ? AND user_id = ?',
            [cartId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        const [countRows] = await db.query(
            'SELECT COALESCE(SUM(quantity), 0) AS cart_count FROM cart WHERE user_id = ?',
            [userId]
        );

        res.status(200).json({
            message: 'Item removed from cart',
            cartCount: countRows[0].cart_count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove cart item' });
    }
});

module.exports = router;
