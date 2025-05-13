const Order = require('../models/Order');

const placeOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to place order' });
    }
};

module.exports = { placeOrder };
