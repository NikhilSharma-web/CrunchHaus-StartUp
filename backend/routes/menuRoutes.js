// routes/menuRoutes.js

const express = require('express');
const router = express.Router();
const Menu = require('../models/MenuItem'); // Assuming MenuItem is the model name

router.post('/', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const newItem = new Menu({ name, description, price });
        await newItem.save();
        res.status(201).json({ message: 'Menu item saved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
