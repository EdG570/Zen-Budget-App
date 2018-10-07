const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { Group, validate } = require('../models/Group')
const mongoose = require('mongoose')
const debug = require('debug')('App')

router.post('/', auth, async (req, res) => {
    const userId = req.user._id

    const { error } = validate(req.body)
    if (error) res.status(400).send(error.details[0].message)

    let group = await Group.findOne({  name: req.body.name })
    if (group) return res.status(400).send('Group already exists')

    group = new Group ({
        userId,
        name: req.body.name
    })

    try {
        await group.save()
        res.status(200).send(group)
    }
    catch(error) {
        res.status(500).send('A server error has occurred')
    }
    
})

module.exports = router