require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// Welcome route
app.get('/', async (req, res) => {
    try {
        res.json({ message: 'Welcome to Practical Exam!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Auth endpoints
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

// Protected Product endpoints
app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

// Protected Order endpoints
app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);

// Customer endpoints (reference)
app.use('/api/customers', customerRoutes);
app.use('/customers', customerRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 9999;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
