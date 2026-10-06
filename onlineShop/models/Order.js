const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Customer',
        required: true 
    },
    items: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number }
    }],
    total_amount: { type: Number, required: true },
    payment_method: { 
        type: String, 
        enum: ['Credit Card', 'COD'],
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Completed'], 
        default: 'Pending'
    },
    order_date: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true 
});

exports.Order = mongoose.model('Order', orderSchema);