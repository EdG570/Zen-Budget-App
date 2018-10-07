const express = require('express')
const router = express.Router()
const { User, validate } = require('../models/User')
const mongoose = require('mongoose')
const debug = require('debug')('App')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secrets = require('../config/secrets')
const auth = require('../middleware/auth')

router.get('/me', auth, async (req, res) => {
    const id = req.user._id;

    let user = await User.findById(id).select('-password')
    res.send(user)
})

router.post('/', async (req, res) => {
    debug(req.body)
    const { error } = validate(req.body)
    if (error) res.status(400).send(error.details[0].message)

    let user = await User.findOne({  email: req.body.email })
    if (user) return res.status(400).send('User already exists')

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(req.body.password, salt)

    user = new User ({
        name: req.body.name,
        email: req.body.email,
        password: hash
    })

    await user.save()
    const token = jwt.sign({ _id: user._id }, secrets.jwt)

    res.header('x-auth-token', token).send({
        name: user.name, 
        email: user.email,
        isAdmin: user.isAdmin,
        isActive: user.isActive
    })
})


module.exports = router