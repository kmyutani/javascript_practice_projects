const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    incomeTransactions: [{
        _id: false,
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        income: {
            type: Number,
            default: 0
        }
    }],
    expensesTransaction: [{
        _id: false,
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        expenses: {
            type: Number,
            default: 0
        }
    }]

});

module.exports = mongoose.model('Transaction', transactionSchema);