const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/products
// Returns all active products with their category names.
router.get('/', async (req, res) => {
    try {
        const tag = String(req.query.tag || '').trim().toUpperCase();
        if (tag === 'FEATURED') {
            const [featured] = await db.query(
                `SELECT
                    p.product_id,
                    p.name,
                    p.description,
                    p.price,
                    p.image_url,
                    p.stock_qty,
                    p.is_active,
                    p.tag,
                    c.category_id,
                    c.name AS category_name
                 FROM products p
                 LEFT JOIN categories c ON c.category_id = p.category_id
                 WHERE p.is_active = 1 AND p.tag = 'FEATURED'
                 ORDER BY p.product_id DESC
                 LIMIT 3`
            );
            return res.json(featured);
        }

        const filter = String(req.query.filter || '').toLowerCase();
        let categoryIds = null;

        if (filter === 'coffee') categoryIds = [1, 2];
        if (filter === 'menu') categoryIds = [1, 2, 5];
        if (filter === 'shop') categoryIds = [3, 4];

        const params = [];
        let categoryClause = '';
        if (Array.isArray(categoryIds)) {
            categoryClause = ` AND p.category_id IN (${categoryIds.map(() => '?').join(', ')})`;
            params.push(...categoryIds);
        }

        const [products] = await db.query(
            `SELECT
                p.product_id,
                p.name,
                p.description,
                p.price,
                p.image_url,
                p.stock_qty,
                p.is_active,
                p.tag,
                c.category_id,
                c.name AS category_name
             FROM products p
             LEFT JOIN categories c ON c.category_id = p.category_id
             WHERE p.is_active = 1${categoryClause}
             ORDER BY p.product_id DESC`,
            params
        );

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

module.exports = router;
