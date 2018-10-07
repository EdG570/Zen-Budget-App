const express = require('express')
const router = express.Router()
const { User } = require('../models/User')
const mongoose = require('mongoose')
const debug = require('debug')('App')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) res.status(400).send(error.details[0].message)

    let user = await User.findOne({  email: req.body.email })
    if (!user) return res.status(400).send('Invalid email or password')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid email or password')

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    res.header('x-auth-token', token).send({
        email: user.email,
        isActive: user.isActive
    })
})

function validate(body) {
    const schema = { 
        email: Joi.string().required().min(5).max(255),
        password: Joi.string().min(6).max(1024)
    }

    return Joi.validate(body, schema);
}

module.exports = router