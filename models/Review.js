const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    mysql_product_id: {
        type: Number,
        required: true,
        index: true
    },
    mysql_user_id: {
        type: Number,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', reviewSchema);
