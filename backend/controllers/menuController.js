const MenuItem = require('../models/MenuItem');

const addMenuItem = async (req, res) => {
    try {
        const menuItem = new MenuItem(req.body);
        await menuItem.save();
        res.status(201).json({ message: 'Menu item saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save menu item' });
    }
};

module.exports = { addMenuItem };
