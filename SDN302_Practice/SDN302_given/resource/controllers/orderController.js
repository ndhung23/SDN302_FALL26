const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customer_id')
            .populate('items.product_id')
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to retrieve orders',
            error: error.message
        });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = await Order.findById(id)
            .populate('customer_id')
            .populate('items.product_id');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to retrieve order',
            error: error.message
        });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { customer_id, items, payment_method, status, order_date } = req.body;

        // 1. Validate customer_id
        if (!customer_id || !mongoose.Types.ObjectId.isValid(customer_id)) {
            return res.status(400).json({ message: 'Valid customer_id is required' });
        }

        const customer = await Customer.findById(customer_id);
        if (!customer) {
            return res.status(400).json({ message: 'Customer not found' });
        }

        // 2. Validate items array
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }

        // 3. Validate payment_method & status
        if (!payment_method || typeof payment_method !== 'string' || !payment_method.trim()) {
            return res.status(400).json({ message: 'payment_method is required' });
        }
        if (!status || typeof status !== 'string' || !status.trim()) {
            return res.status(400).json({ message: 'status is required' });
        }

        let parsedOrderDate = new Date();
        if (order_date) {
            parsedOrderDate = new Date(order_date);
            if (isNaN(parsedOrderDate.getTime())) {
                return res.status(400).json({ message: 'Invalid order_date format' });
            }
        }

        // 4. Validate products, quantities, available stock and calculate totals
        let total_amount = 0;
        const processedItems = [];
        const stockUpdates = [];

        for (const item of items) {
            if (!item.product_id || !mongoose.Types.ObjectId.isValid(item.product_id)) {
                return res.status(400).json({
                    message: `Invalid or missing product_id: ${item.product_id}`
                });
            }

            if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1) {
                return res.status(400).json({
                    message: `Quantity must be an integer >= 1 for product ${item.product_id}`
                });
            }

            const product = await Product.findById(item.product_id);
            if (!product) {
                return res.status(400).json({
                    message: `Product not found: ${item.product_id}`
                });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({
                    message: `Requested quantity (${item.quantity}) exceeds available stock (${product.stock}) for product '${product.name}'`
                });
            }

            const price_at_order = product.price;
            const itemTotal = price_at_order * item.quantity;
            total_amount += itemTotal;

            processedItems.push({
                product_id: product._id,
                quantity: item.quantity,
                price_at_order,
                total: itemTotal
            });

            stockUpdates.push({
                product,
                newStock: product.stock - item.quantity
            });
        }

        // Deduct stock for each purchased product
        for (const update of stockUpdates) {
            update.product.stock = update.newStock;
            await update.product.save();
        }

        // Create new Order document
        const order = new Order({
            customer_id,
            items: processedItems,
            total_amount,
            payment_method: payment_method.trim(),
            status: status.trim(),
            order_date: parsedOrderDate
        });

        const savedOrder = await order.save();

        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('customer_id')
            .populate('items.product_id');

        return res.status(201).json(populatedOrder);
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to create order',
            error: error.message
        });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const { status, payment_method, order_date } = req.body;

        if (status !== undefined) {
            if (typeof status !== 'string' || !status.trim()) {
                return res.status(400).json({ message: 'Status cannot be empty' });
            }
            order.status = status.trim();
        }

        if (payment_method !== undefined) {
            if (typeof payment_method !== 'string' || !payment_method.trim()) {
                return res.status(400).json({ message: 'Payment method cannot be empty' });
            }
            order.payment_method = payment_method.trim();
        }

        if (order_date !== undefined) {
            const parsedDate = new Date(order_date);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ message: 'Invalid order_date format' });
            }
            order.order_date = parsedDate;
        }

        const savedOrder = await order.save();

        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('customer_id')
            .populate('items.product_id');

        return res.status(200).json(populatedOrder);
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to update order',
            error: error.message
        });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await Order.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Order deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to delete order',
            error: error.message
        });
    }
};

