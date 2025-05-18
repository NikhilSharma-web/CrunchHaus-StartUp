const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// ✅ Middleware to require login
function requireLogin(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'You must be logged in to place an order.' });
    }
    next();
}

// ✅ POST /order - Save a new customer order (only if logged in)
router.post('/', requireLogin, async (req, res) => {
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
            totalPrice,
            userId: req.session.userId // optional: link to user
        });

        await newOrder.save();
        res.status(201).json({ message: '✅ Order placed successfully.' });
    } catch (err) {
        console.error('❌ Error saving order:', err.message);
        res.status(500).json({ error: 'Server error while placing the order.' });
    }
});

module.exports = router;
