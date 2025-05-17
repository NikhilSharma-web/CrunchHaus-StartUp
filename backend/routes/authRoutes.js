const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// ✅ SIGNUP ROUTE
// routes/authRoutes.js

// Signup
// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.redirect('/signup?error=' + encodeURIComponent('Please fill in all fields'));
        }

        if (password !== confirmPassword) {
            return res.redirect('/signup?error=' + encodeURIComponent('Passwords do not match'));
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.redirect('/signup?error=' + encodeURIComponent('User already exists'));
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashed
        });

        req.session.userId = newUser._id;
        res.redirect('/?success=' + encodeURIComponent('Signup successful! Welcome to CrunchHaus!'));
    } catch (err) {
        console.error('❌ Signup error:', err);
        res.redirect('/signup?error=' + encodeURIComponent('Server error, please try again'));
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.redirect('/login?error=' + encodeURIComponent('Please provide email and password'));
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            return res.redirect('/login?success=' + encodeURIComponent('You are logged in. Welcome to CrunchHaus!'));
        } else {
            return res.redirect('/login?error=' + encodeURIComponent('Invalid credentials'));
        }

    } catch (err) {
        console.error('Login error:', err);
        res.redirect('/login?error=' + encodeURIComponent('Server error, please try again'));
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/?error=' + encodeURIComponent('Could not log out.'));
        }
        res.redirect('/login?success=' + encodeURIComponent('You have logged out. See you soon!'));
    });
});


module.exports = router;
