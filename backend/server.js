const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Session middleware
app.use(session({
    secret: 'crunchhaus-secret',
    resave: false,
    saveUninitialized: false
}));

// Static files
app.use(express.static(path.join(__dirname, '..')));

// Middleware: require login
function requireLogin(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    return res.redirect('/login');
}

// Auth routes (login, signup, logout etc.) - no login required
app.use(authRoutes);

// Protected API routes
const menuRoutes = require('./routes/menuRoutes');
const contactRoutes = require('./routes/contactRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/menu', requireLogin, menuRoutes);
app.use('/contact', requireLogin, contactRoutes);
app.use('/order', requireLogin, orderRoutes);

// Login and signup pages accessible without login
app.get('/login', (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.sendFile(path.join(__dirname, '..', 'html', 'login.html'));
});

app.get('/signup', (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.sendFile(path.join(__dirname, '..', 'html', 'signup.html'));
});

// Root route: redirect to login if not logged in, else main page
app.get('/', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Protected pages
app.get('/menu', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'menu.html'));
});

app.get('/order', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'order.html'));
});

app.get('/contact', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'contact.html'));
});

// 404 fallback - must be last
app.use((req, res) => {
    res.status(404).send('❌ Route not found');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on Port ${PORT}`);
});
