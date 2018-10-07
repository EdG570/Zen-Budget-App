const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

const userSchema = new Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        minlength: 5, 
        maxlength: 255 
    },
    password: { 
        type: String, 
        minlength: 6, 
        maxlength: 1024, 
        required: true 
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

const User = mongoose.model('User', userSchema)

function validateUser(body) {
    const schema = { 
        email: Joi.string().required().min(5).max(255),
        password: Joi.string().min(6).max(1024).required()
    }

    return Joi.validate(body, schema);
}

module.exports.User = User
module.exports.validate = validateUser