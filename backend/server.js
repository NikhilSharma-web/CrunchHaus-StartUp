// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const PORT = 5000;
// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // needed to parse JSON request body
app.use(express.static(path.join(__dirname, '..'))); // Serving all files



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

// Serve static assets if in production

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html')); // Adjust path if needed
});
app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'menu.html'));
});

app.get('/order', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'order.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'contact.html'));
});

// Fallback route
app.use((req, res) => {
    res.status(404).send('❌ Route not found');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on ${PORT}`);
});