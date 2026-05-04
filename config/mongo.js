const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is missing in environment variables');
        }
        
        await mongoose.connect(uri);
        console.log('✅ MongoDB connected successfully for reviews');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        // Do not exit process to keep MySQL alive even if Mongo fails
    }
};

module.exports = connectMongoDB;
