const { Customer } = require('../models/Customer');

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const { name, phone, email, address } = req.body;
        const newCustomer = new Customer({ name, phone, email, address });
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } 
};

exports.updateCustomer = async (req, res) => {
    try {
        const { name, phone, email, address } = req.body;
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, phone, email, address },
            { new: true }
        );
        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};