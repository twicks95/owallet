const express = require('express')
const Route = express.Router()
const userController = require('./user_controller')

Route.get('/:id', userController.getUser)
Route.patch('/:id', userController.updateData)
Route.patch('/password/update/:id', userController.updatePassword)

module.exports = Route
