const express = require('express');
const debug = require('debug')('App')
const morgan = require('morgan')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const config = require('./config/config')
const db = require('./db')()
const cors = require('cors')
const error = require('./middleware/error')
const winston = require('winston')
require('dotenv').config()

const usersRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const groupRoutes = require('./routes/groups')
const categoryRoutes = require('./routes/categories')
const transactionRoutes = require('./routes/transactions')

const app = express()

app.disable('etag');

winston.add(winston.transports.File, { filename: 'logfile.log' })

app.use(cors({ exposedHeaders: 'x-auth-token'}))
app.use(helmet())
app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/users', usersRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/transactions', transactionRoutes)

app.use(error)

const port = config.app.port;
app.listen(port, () => debug(`Express is listening on port: ${ port }`))


