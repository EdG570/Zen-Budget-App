const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { Group, validate } = require('../models/Group')
const { User } = require('../models/User')
const mongoose = require('mongoose')
const debug = require('debug')('App')
const asyncMiddleware = require('../middleware/async')

router.post('/', auth, asyncMiddleware(async (req, res, next) => {
    const userId = req.user._id

    let user = await User.findById(userId).populate({ path: 'groups', name: req.body.name })
    if (user.group) res.status(400).send({ error: 'Group already exists' })

    const { error } = validate(req.body)
    if (error) res.status(400).send({ error: error.details[0].message })

    group = new Group ({ userId, name: req.body.name })
    user.groups.push(group)

    await group.save()
    await user.save()
    res.status(200).send(group)
}))

router.get('/', auth, asyncMiddleware(async (req, res, next) => {
    const userId = req.user._id

    let groups = await User.findById(userId)
                           .populate({ path: 'groups', 
                                populate: { path: 'categories', match: { "endDate": { $exists: false } }, 
                                populate: { path: 'transactions'} }})
                           .select('-password')
                           .select('-_id')
    res.send(groups)
}))

router.get('/:id', auth, asyncMiddleware(async (req, res, next) => {
    const groupId = req.params.id

    let group = await Group.findById(groupId)
    if (!group) return res.status(404).send({ error: 'Group was not found'})

    res.send(group)
}))

module.exports = router