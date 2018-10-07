const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

const groupSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        minlength: 2, 
        maxlength: 100 
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId
    }
})

const Group = mongoose.model('Group', groupSchema)

function validateGroup(body) {
    const schema = { 
        name: Joi.string().required().min(2).max(100)
    }

    return Joi.validate(body, schema);
}

module.exports.Group = Group
module.exports.validate = validateGroup