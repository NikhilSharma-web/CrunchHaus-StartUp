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

// Static files (but no auto index.html shown)
app.use(express.static(path.join(__dirname, '..'), { index: false }));

//  Middleware: require login
function requireLogin(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    return res.redirect('/login');
}

//  Auth routes (no login required)
app.use(authRoutes);

//Protected API routes
const menuRoutes = require('./routes/menuRoutes');
const contactRoutes = require('./routes/contactRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/menu', requireLogin, menuRoutes);
app.use('/contact', requireLogin, contactRoutes);
app.use('/order', requireLogin, orderRoutes);

// login and signup
app.get('/login', (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.sendFile(path.join(__dirname, '..', 'html', 'login.html'));
});

app.get('/signup', (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.sendFile(path.join(__dirname, '..', 'html', 'signup.html'));
});

// Protected HTML pages
app.get('/', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/menu', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'menu.html'));
});

app.get('/order', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'order.html'));
});

app.get('/contact', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'contact.html'));
});

// 404
app.use((req, res) => {
    res.status(404).send('❌ Route not found');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on Port ${PORT}`);
});
