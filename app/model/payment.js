var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ''
    },
    note: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    }
});

var payment = new mongoose.model('Payment', schema);

module.exports = payment;