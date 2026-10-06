require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(express.json());
app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

connectDB();

app.get('/', async(req, res)=>{
    try {
        res.send({message: 'Welcome to Practical Exam!'});
    } catch (error) {
        res.send({error: error.message});
    }
});

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));