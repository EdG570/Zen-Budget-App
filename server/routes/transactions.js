const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { Transaction, validate } = require('../models/Transaction')
const { Category } = require('../models/Category')
const mongoose = require('mongoose')
const debug = require('debug')('App')
const asyncMiddleware = require('../middleware/async')

// Create a new transaction
router.post('/:id', auth, asyncMiddleware(async (req, res, next) => {
    const categoryId = req.params.id
    const body = {
        type: req.body.type,
        note: req.body.note,
        date: req.body.date,
        total: req.body.total,
        categoryId: mongoose.Types.ObjectId(categoryId)
    }
    
    const { error } = validate(body)
    if (error) return res.status(400).send({ error: error.details[0].message })
   
    let category = await Category.findById(categoryId)
    if (!category) return res.status(404).send({ error: 'Category was not found' })

    let transaction = new Transaction({
        type: body.type,
        date: body.date,
        note: body.note,
        total: parseFloat(body.total),
        categoryId: body.categoryId
    })

    await transaction.save()
    category.transactions.push(transaction)
    await category.save()
    res.status(200).send(transaction)
}))

module.exports = router