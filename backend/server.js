const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Serve static CSS files
app.use('/css', express.static(path.join(__dirname, 'css')));

// Serve root index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve any html files inside html folder or nested folders
app.get('/*', (req, res) => {
    const requestedPath = req.params[0]; // e.g. "about" or "explore/explore"
    const filePath = path.join(__dirname, 'html', requestedPath + '.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('❌ Page not found');
        }
    });
});

// API routes
const menuRoutes = require('./routes/menuRoutes');
const contactRoutes = require('./routes/contactRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/menu', menuRoutes);
app.use('/contact', contactRoutes);
app.use('/order', orderRoutes);

// Fallback 404 for API or unknown routes
app.use((req, res) => {
    res.status(404).send('❌ Route not found');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
