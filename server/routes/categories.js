const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { Category, validate } = require('../models/Category')
const { Group } = require('../models/Group')
const mongoose = require('mongoose')
const debug = require('debug')('App')
const asyncMiddleware = require('../middleware/async')

// Create a new Category
router.post('/', auth, asyncMiddleware(async (req, res, next) => {
    const userId = req.user._id

    const { error } = validate(req.body)
    if (error) return res.status(400).send({ error: error.details[0].message })

    let group = await Group.findById(req.body.groupId)
    if (!group) return res.status(400).send({ error: 'Group does not exist' })

    category = new Category ({
        groupId: req.body.groupId,
        name: req.body.name,
        budget: req.body.budget    
    })

    group.categories.push(category)
        
    await category.save()
    await group.save()
    res.status(200).send(category) 
}))

router.put('/end/:id', auth, asyncMiddleware(async (req, res) => {
    const id = req.params.id

    let category = await Category.findById(id)
    if (!category) return res.status(400).send({ error: 'Category does not exist' })

    let response = await Category.updateOne({ "_id": id }, { $set: { "endDate" : Date.now() } })
    if (response.ok == 1) {
        let updatedCategory = await Category.findById(id)
        return res.status(200).send(updatedCategory)
    }
    else {
        return res.status(500).send({ error: 'Something went wrong. Unable to update category'})
    }
}))

router.put('/:id', auth, asyncMiddleware(async (req, res) => {
    const id = req.params.id

    let category = await Category.findById(id)
    if (!category) return res.status(400).send({ error: 'Category does not exist' })

    let response = await Category.updateOne({ "_id": id }, { $set: { "name" : req.body.name, "budget": req.body.budget } })
    if (response.ok == 1) {
        let updatedCategory = await Category.findById(id)
         return res.status(200).send(updatedCategory)
    }
    else {
        return res.status(500).send({ error: 'Something went wrong. Unable to update category'})
    }
}))


module.exports = router