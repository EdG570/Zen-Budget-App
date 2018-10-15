const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

const transactionSchema = new Schema({
    type: { 
        type: String, 
        required: true, 
        minlength: 2, 
        maxlength: 100 
    },
    total: {
        type: Number,
        required: true,
        min: 1,
        max: 1000000
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    note: {
       type: String,
       minlength: 2,
       maxlength: 255 
    },
    categoryId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category'
    }
})

const Transaction = mongoose.model('Transaction', transactionSchema)

function validateTransaction(body) {
    const schema = { 
        type: Joi.string().required().min(2).max(100),
        total: Joi.number().required().max(1000000),
        note: Joi.string().min(2).max(255).optional(),
        date: Joi.date(),
        categoryId: Joi.object()
    }

    return Joi.validate(body, schema);
}

module.exports.Transaction = Transaction
module.exports.validate = validateTransaction