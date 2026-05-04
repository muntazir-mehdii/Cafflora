const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Review = require('../models/Review');

// Reusing the robust auth middleware from other routes
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

// GET /api/reviews/:productId - Fetch all reviews for a specific MySQL product ID
router.get('/:productId', async (req, res) => {
    try {
        const productId = Number(req.params.productId);
        if (!Number.isInteger(productId) || productId < 1) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        // Fetch from MongoDB, sort by newest first
        const reviews = await Review.find({ mysql_product_id: productId })
            .sort({ created_at: -1 })
            .select('-__v'); // Exclude mongoose version key

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// POST /api/reviews - Submit a new review
router.post('/', requireAuth, async (req, res) => {
    try {
        const userId = Number(req.user.id);
        const { product_id, rating, comment } = req.body;

        const productId = Number(product_id);
        const reviewRating = Number(rating);

        if (!Number.isInteger(productId) || productId < 1) {
            return res.status(400).json({ error: 'Valid product ID is required' });
        }

        if (!Number.isInteger(reviewRating) || reviewRating < 1 || reviewRating > 5) {
            return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
        }

        // The user's name would ideally come from the decoded token if included,
        // or fetched from MySQL. For simplicity, if it's not in the token, we can
        // take it from the request body or use a default.
        const userName = req.user.name || req.body.user_name || 'Customer';

        // Create new MongoDB document
        const newReview = new Review({
            mysql_product_id: productId,
            mysql_user_id: userId,
            user_name: userName,
            rating: reviewRating,
            comment: comment || ''
        });

        const savedReview = await newReview.save();

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            review: savedReview
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

module.exports = router;
