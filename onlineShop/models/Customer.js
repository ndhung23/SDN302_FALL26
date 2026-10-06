const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({    
    name: { type: String, required: true },
    phone: { type: String, required: true , unique: true, minlength: 2, maxlength: 10 },
    email: { type: String, required: true , unique: true },
    address: { type: String, required: true }
});

exports.Customer = mongoose.model('Customer', customerSchema);