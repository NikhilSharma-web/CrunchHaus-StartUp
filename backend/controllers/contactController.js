const Contact = require('../models/Contact');

const saveContact = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ message: 'Contact details saved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save contact details' });
    }
};

module.exports = { saveContact };
