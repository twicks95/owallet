const express = require('express')
const Router = express.Router()
const topupController = require('./topup_controller')

Router.post('/:id', topupController.createTopup)

module.exports = Router
