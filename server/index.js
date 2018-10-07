const express = require('express');
const debug = require('debug')('App')

const config = require('./config/config');

const app = express()

const port = config.app.port;
app.listen(port, () => debug(`Express is listening on port: ${ port }`))


