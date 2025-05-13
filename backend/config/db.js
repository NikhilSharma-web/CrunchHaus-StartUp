const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MongoDB URI is not defined in the .env file");
            return process.exit(1);  // Exit if MONGO_URI is missing
        }

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);  // Exit on connection error
    }
};

module.exports = connectDB;
