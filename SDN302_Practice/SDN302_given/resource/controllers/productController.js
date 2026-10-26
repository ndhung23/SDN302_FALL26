const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to retrieve products',
            error: error.message
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to retrieve product',
            error: error.message
        });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, price, category, stock } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Product name is required' });
        }
        if (price === undefined || price === null || typeof price !== 'number' || price < 0) {
            return res.status(400).json({ message: 'Price is required and must be a number >= 0' });
        }
        if (!category || typeof category !== 'string' || !category.trim()) {
            return res.status(400).json({ message: 'Category is required' });
        }
        if (stock === undefined || stock === null || typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ message: 'Stock is required and must be a number >= 0' });
        }

        const product = new Product({
            name: name.trim(),
            price,
            category: category.trim(),
            stock
        });

        const savedProduct = await product.save();
        return res.status(201).json(savedProduct);
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to create product',
            error: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { name, price, category, stock } = req.body;

        if (name !== undefined) {
            if (typeof name !== 'string' || !name.trim()) {
                return res.status(400).json({ message: 'Product name cannot be empty' });
            }
            product.name = name.trim();
        }

        if (price !== undefined) {
            if (typeof price !== 'number' || price < 0) {
                return res.status(400).json({ message: 'Price must be a number >= 0' });
            }
            product.price = price;
        }

        if (category !== undefined) {
            if (typeof category !== 'string' || !category.trim()) {
                return res.status(400).json({ message: 'Category cannot be empty' });
            }
            product.category = category.trim();
        }

        if (stock !== undefined) {
            if (typeof stock !== 'number' || stock < 0) {
                return res.status(400).json({ message: 'Stock must be a number >= 0' });
            }
            product.stock = stock;
        }

        const updatedProduct = await product.save();
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to update product',
            error: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if any order references this product
        const referencedInOrder = await Order.findOne({ 'items.product_id': id });
        if (referencedInOrder) {
            return res.status(409).json({
                message: 'Cannot delete product because it is referenced in one or more orders'
            });
        }

        await Product.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to delete product',
            error: error.message
        });
    }
};

