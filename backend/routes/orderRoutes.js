const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Import your Mongoose model

// POST /order - Save a new customer order
router.post('/', async (req, res) => {
    try {
        const { name, address, phone, paymentMethod, items, totalPrice } = req.body;

        // Basic validation
        if (!name || !address || !phone || !paymentMethod || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'All fields and at least one item are required.' });
        }

        const newOrder = new Order({
            name,
            address,
            phone,
            paymentMethod,
            items,
            totalPrice
        });

        await newOrder.save();
        res.status(201).json({ message: '✅ Order placed successfully.' });
    } catch (err) {
        console.error('❌ Error saving order:', err.message);
        res.status(500).json({ error: 'Server error while placing the order.' });
    }
});

module.exports = router;
