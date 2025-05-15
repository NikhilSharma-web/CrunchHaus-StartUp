// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import route files
const menuRoutes = require('./routes/menuRoutes');
const contactRoutes = require('./routes/contactRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();

app.use('/menu', menuRoutes);
app.use('/contact', contactRoutes);
app.use('/order', orderRoutes);

const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.use(express.json()); // needed to parse JSON request body

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Serve CSS files statically from /css
app.use('/css', express.static(path.join(__dirname, 'css')));

// Serve main index.html on root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve other HTML pages from /html folder
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const allowedPages = ['cart', 'contact', 'explore', 'menu', 'order']; // add your HTML file names without .html here
    if (allowedPages.includes(page)) {
        res.sendFile(path.join(__dirname, 'html', `${page}.html`));
    } else {
        res.status(404).send('❌ Page not found');
    }
});

// API Routes
app.use('/menu', menuRoutes);
app.use('/contact', contactRoutes);
app.use('/order', orderRoutes);

// Fallback for other API routes
app.use((req, res) => {
    res.status(404).send('❌ Route not found');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
