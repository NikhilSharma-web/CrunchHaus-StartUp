// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
