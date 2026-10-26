const mongoose = require('mongoose');
const Customer = require('../models/Customer');

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        return res.status(200).json(customers);
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to retrieve customers',
            error: error.message
        });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        return res.status(200).json(customer);
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to retrieve customer',
            error: error.message
        });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const { name, phone, email, address } = req.body;
        if (!name || !phone || !email || !address) {
            return res.status(400).json({ message: 'name, phone, email, and address are required' });
        }

        const customer = new Customer({ name, phone, email, address });
        const savedCustomer = await customer.save();
        return res.status(201).json(savedCustomer);
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to create customer',
            error: error.message
        });
    }
};

