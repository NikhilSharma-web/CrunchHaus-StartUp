// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Body: ${JSON.stringify(req.body)}`);
    next();
});
const app = express();
const PORT = 8000;

// Middlewares
app.use(cors());
app.use(express.json()); // needed to parse JSON request body

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const menuRoutes = require('./routes/menuRoutes');
const contactRoutes = require('./routes/contactRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/menu', menuRoutes);
app.use('/contact', contactRoutes);
app.use('/order', orderRoutes);

// Fallback route
app.use((req, res) => {
    res.status(404).send('❌ Route not found');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});