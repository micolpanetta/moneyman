var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    month: {
        type: Number,
    },
    year: {
        type: Number,
        required: true,
    },
    period: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
});

var budget = new mongoose.model('Budget', schema);

module.exports = budget;