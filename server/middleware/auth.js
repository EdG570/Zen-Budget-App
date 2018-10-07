const jwt = require('jsonwebtoken')
const secrets = require('../config/secrets')
const debug = require('debug')('App')

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).send('Access denied. No token provided.')

    try {
        const decoded = jwt.verify(token, secrets.jwt)
        req.user = decoded
        next()
    }
    catch (error) {
        debug(error.message)
        res.status(400).send('Invalid token.')
    }
}