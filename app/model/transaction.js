var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    category: {
        type: String,
    },
    date: {
        type: String,
    },
    description: {
        type: String,
    },
    note: {
        type: String,
    },
    amount: {
        type: Number,
    },
    budget: {
        type: Number,
    }
});

var transaction = new mongoose.model('Transaction', schema);

module.exports = transaction;