const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const contactRoutes = require('./routes/contactRoutes');
const orderRoutes = require('./routes/orderRoutes'); // ✅ Correctly required once

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Session
app.use(session({
    secret: 'crunchhaus-secret',
    resave: false,
    saveUninitialized: false
}));

// Middleware: require login
function requireLogin(req, res, next) {
    if (req.session.userId) return next();
    return res.redirect('/login');
}

// Auth routes
app.use(authRoutes);

// Login page
app.get('/login', (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.sendFile(path.join(__dirname, '..', 'html', 'login.html'));
});

// Signup page
app.get('/signup', (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.sendFile(path.join(__dirname, '..', 'html', 'signup.html'));
});

// Static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, '..')));

// Root route
app.get('/', (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ✅ Protected API routes
app.use('/menu', requireLogin, menuRoutes);
app.use('/contact', requireLogin, contactRoutes);
app.use('/order', requireLogin, orderRoutes); // ✅ Now fully effective

// ✅ Protected HTML pages
app.get('/menu', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'menu.html'));
});

app.get('/order', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'order.html'));
});

app.get('/contact', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'contact.html'));
});

// 404 fallback
app.use((req, res) => {
    res.status(404).send('❌ Route not found');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on Port ${PORT}`);
});
