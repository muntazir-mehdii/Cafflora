const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/db');

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Invalid authentication token' });
        }
        req.user = decoded;
        return next();
    } catch (_) {
        return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }
}

function roundToCents(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
}

function badRequest(message) {
    const error = new Error(message);
    error.status = 400;
    return error;
}

// GET /api/orders/my-orders (protected)
router.get('/my-orders', requireAuth, async (req, res) => {
    const userId = Number(req.user && req.user.id);
    if (!Number.isInteger(userId) || userId < 1) {
        return res.status(401).json({ error: 'Invalid user context' });
    }

    try {
        const [orders] = await db.query(
            `SELECT
                order_number,
                total_amount,
                payment_method,
                order_status,
                created_at
             FROM orders
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );
        return res.json(Array.isArray(orders) ? orders : []);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch order history' });
    }
});

// POST /api/orders (protected)
router.post('/', requireAuth, async (req, res) => {
    const userId = Number(req.user && req.user.id);
    if (!Number.isInteger(userId) || userId < 1) {
        return res.status(401).json({ error: 'Invalid user context' });
    }

    const {
        items = [],
        subtotal,
        discount_applied,
        shipping_fee,
        total_amount,
        payment_method,
        payment_details = {}
    } = req.body || {};

    const clientSubtotal = roundToCents(subtotal);
    const safeDiscount = roundToCents(discount_applied);
    const safeShipping = roundToCents(shipping_fee);
    const safeTotal = roundToCents(total_amount);
    const method = String(payment_method || '').toUpperCase();

    if (!method || !['CARD', 'WALLET', 'COD'].includes(method)) {
        return res.status(400).json({ error: 'Valid payment_method is required' });
    }

    if (clientSubtotal < 0 || safeDiscount < 0 || safeShipping < 0 || safeTotal <= 0) {
        return res.status(400).json({ error: 'Invalid order totals' });
    }

    if (!Array.isArray(items) || !items.length) {
        return res.status(400).json({ error: 'Order must include at least one item' });
    }

    const orderNumber = `ORD-${Date.now()}`;

    // Secure Card Masking Simulation:
    // - Store ONLY the last 4 digits.
    // - Persist it as: "**** **** **** 1234"
    // - Completely discard CVV.
    function maskCardNumber(cardNumberRaw) {
        const digits = String(cardNumberRaw || '').replace(/\D/g, '');
        const last4 = digits.slice(-4);
        if (!last4) return '';
        return `**** **** **** ${last4}`;
    }

    let conn;
    try {
        conn = await db.getConnection();
        await conn.beginTransaction();

        // Ensure payment tables exist (project currently only has `orders` + `order_items`).
        await conn.query(
            `CREATE TABLE IF NOT EXISTS payment_credit_cards (
                payment_id INT NOT NULL AUTO_INCREMENT,
                order_id INT NOT NULL,
                name_on_card VARCHAR(120) NOT NULL,
                masked_card_number VARCHAR(32) NOT NULL,
                expiry VARCHAR(10) NOT NULL,
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (payment_id),
                KEY idx_payment_credit_cards_order_id (order_id),
                CONSTRAINT fk_payment_credit_cards_order
                    FOREIGN KEY (order_id) REFERENCES orders(order_id)
                    ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
        );

        await conn.query(
            `CREATE TABLE IF NOT EXISTS payment_digital_wallets (
                payment_id INT NOT NULL AUTO_INCREMENT,
                order_id INT NOT NULL,
                provider VARCHAR(40) NOT NULL,
                account_number VARCHAR(40) NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (payment_id),
                KEY idx_payment_digital_wallets_order_id (order_id),
                CONSTRAINT fk_payment_digital_wallets_order
                    FOREIGN KEY (order_id) REFERENCES orders(order_id)
                    ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
        );

        // Normalize and validate incoming items
        const normalizedItems = items
            .map((it) => ({
                product_id: Number(it && (it.product_id ?? it.productId)),
                quantity: Number(it && it.quantity),
                unit_price: roundToCents(it && (it.unit_price ?? it.price))
            }))
            .filter((it) => Number.isInteger(it.product_id) && it.product_id > 0 && Number.isInteger(it.quantity) && it.quantity > 0);

        if (!normalizedItems.length) {
            throw badRequest('No valid order items provided');
        }

        // Fetch authoritative prices from DB to prevent client tampering.
        const productIds = Array.from(new Set(normalizedItems.map((it) => it.product_id)));
        const placeholders = productIds.map(() => '?').join(', ');
        const [priceRows] = await conn.query(
            `SELECT product_id, price, is_active
             FROM products
             WHERE product_id IN (${placeholders})`,
            productIds
        );

        const pricesById = new Map();
        priceRows.forEach((row) => {
            if (Number(row.is_active) === 1) {
                pricesById.set(Number(row.product_id), roundToCents(row.price));
            }
        });

        const validatedItems = normalizedItems
            .filter((it) => pricesById.has(it.product_id))
            .map((it) => ({
                product_id: it.product_id,
                quantity: it.quantity,
                unit_price: pricesById.get(it.product_id)
            }));

        if (!validatedItems.length) {
            throw badRequest('No purchasable items found in order');
        }

        const safeSubtotal = roundToCents(
            validatedItems.reduce((sum, it) => sum + (it.unit_price * it.quantity), 0)
        );
        const subtotalDiff = Math.abs(safeSubtotal - clientSubtotal);
        if (subtotalDiff > 0.05) {
            throw badRequest('Order subtotal mismatch. Please refresh and try again.');
        }

        if (safeDiscount > safeSubtotal) {
            throw badRequest('Discount cannot exceed subtotal');
        }

        const [orderResult] = await conn.query(
            `INSERT INTO orders (
                user_id,
                order_number,
                subtotal,
                discount_applied,
                shipping_fee,
                total_amount,
                payment_method
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, orderNumber, safeSubtotal, safeDiscount, safeShipping, safeTotal, method]
        );

        const orderId = orderResult.insertId;

        // Insert trusted order line items for auditing/reporting.
        const values = validatedItems.map((it) => [orderId, it.product_id, it.quantity, it.unit_price]);
        await conn.query(
            `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
             VALUES ?`,
            [values]
        );

        if (method === 'WALLET') {
            const provider = String(payment_details.provider || '').trim();
            const accountNumber = String(payment_details.account_number || '').trim();
            if (!provider || !accountNumber) {
                throw badRequest('Wallet provider and account_number are required');
            }

            await conn.query(
                `INSERT INTO payment_digital_wallets (order_id, provider, account_number, total_amount)
                 VALUES (?, ?, ?, ?)`,
                [orderId, provider, accountNumber, safeTotal]
            );
        }

        if (method === 'CARD') {
            const nameOnCard = String(payment_details.name_on_card || '').trim();
            const expiry = String(payment_details.expiry || '').trim();
            const maskedCardNumber = maskCardNumber(payment_details.cardNumber);

            if (!nameOnCard || !expiry || !maskedCardNumber) {
                throw badRequest('Card payment_details (name_on_card, expiry, cardNumber) are required');
            }

            await conn.query(
                `INSERT INTO payment_credit_cards (order_id, name_on_card, masked_card_number, expiry)
                 VALUES (?, ?, ?, ?)`,
                [orderId, nameOnCard, maskedCardNumber, expiry]
            );
        }

        await conn.commit();
        return res.status(201).json({ success: true, order_number: orderNumber });
    } catch (error) {
        if (conn) {
            try { await conn.rollback(); } catch (_) {}
        }
        console.error(error);
        const status = Number(error && error.status) || 500;
        return res.status(status).json({ error: error.message || 'Failed to place order' });
    } finally {
        if (conn) conn.release();
    }
});

module.exports = router;

