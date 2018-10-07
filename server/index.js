const express = require('express');
const debug = require('debug')('App')
const morgan = require('morgan')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const config = require('./config/config')
const db = require('./db')()
const cors = require('cors')

const app = express()

app.use(cors({ exposedHeaders: 'x-auth-token'}))
app.use(helmet())
app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const port = config.app.port;
app.listen(port, () => debug(`Express is listening on port: ${ port }`))


