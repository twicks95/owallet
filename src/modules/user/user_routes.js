const express = require('express')
const Route = express.Router()
const userController = require('./user_controller')

Route.patch('/password/update/:id', userController.updatePassword)

module.exports = Route
