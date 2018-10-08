const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

const categorySchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        minlength: 2, 
        maxlength: 100 
    },
    budget: {
        type: Number,
        required: true,
        min: 1,
        max: 1000000
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    groupId: {
        type: mongoose.SchemaTypes.ObjectId
    }
})

const Category = mongoose.model('Category', categorySchema)

function validateCategory(body) {
    const schema = { 
        name: Joi.string().required().min(2).max(100),
        budget: Joi.number().required().min(1).max(1000000),
        groupId: Joi.string().required()
    }

    return Joi.validate(body, schema);
}

module.exports.Category = Category
module.exports.validate = validateCategory