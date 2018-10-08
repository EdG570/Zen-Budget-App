const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { Category, validate } = require('../models/Category')
const mongoose = require('mongoose')
const debug = require('debug')('App')

router.post('/', auth, async (req, res) => {
    const userId = req.user._id

    const { error } = validate(req.body)
    if (error) res.status(400).send(error.details[0].message)

    let category = await Group.findOne({  name: req.body.name })
    if (category) return res.status(400).send('Group already exists')

    category = new Category ({
        groupId: req.body.groupId,
        name: req.body.name,
        budget: req.body.budget    
    })

    try {
        await category.save()
        res.status(200).send(category)
    }
    catch(error) {
        res.status(500).send('A server error has occurred')
    }
    
})

module.exports = router