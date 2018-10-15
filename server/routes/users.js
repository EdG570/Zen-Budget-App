const express = require('express')
const router = express.Router()
const { User, validate } = require('../models/User')
const mongoose = require('mongoose')
const debug = require('debug')('App')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const nodemailer = require('nodemailer')
const asyncMiddleware = require('../middleware/async')

router.get('/me', auth, asyncMiddleware(async (req, res) => {
    const id = req.user._id;
    let user = await User.findById(id).select('-password')
    res.send(user)
}))

router.post('/', asyncMiddleware(async (req, res) => {
    debug(req.body)
    const { error } = validate(req.body)
    if (error) res.status(400).send({ error: error.details[0].message })

    let user = await User.findOne({  email: req.body.email })
    if (user) return res.status(400).send({ error: 'User already exists' })

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(req.body.password, salt)

    user = new User ({
        email: req.body.email,
        password: hash
    })

    await user.save()
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    res.header('x-auth-token', token).send({
        email: user.email
    })
}))

router.post('/passwordresetlink', asyncMiddleware(async (req, res, next) => {
    const userEmail = req.body.email

    let user = await User.findOne({ email: userEmail })
    if (!user) return res.status(400).send({ error: 'Unable to find a registered user with email provided'})

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_PW
        }
    });
        
    var mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: userEmail,
        subject: 'ZenBudget: Reset your password',
        html: '<h3>Click on the link below to reset your password for Zen Budget</h3>' +
              `<a href="http://localhost:8080/#/passwordreset">Click this link to reset your password</a>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            debug(error);
            res.status(500).send({ error: 'A server error occurred. Email was not sent.'})
        } else {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
            res.header('x-auth-token', token).status(200).send({ email: user.email })
            debug('Email sent: ' + info.response);
        }
    });    
}))

router.post('/passwordreset', auth, asyncMiddleware(async (req, res) => {
    const id = req.user._id

    let user = await User.findById(id)
    if (!user) return res.status(400).send({ error: 'User not found'})

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(req.body.password, salt)

    user.password = hash
    await user.save()
    res.status(200).send({ email: user.email})
}))


module.exports = router