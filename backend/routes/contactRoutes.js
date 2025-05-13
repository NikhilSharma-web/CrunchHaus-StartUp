const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const contactEntry = new Contact({ name, email, message });
        await contactEntry.save();
        res.status(201).json({ message: '✅ Contact form submitted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
