const express = require('express')
const Route = express.Router()
const authController = require('./auth_controller')

Route.post('/login', authController.login)
Route.post('/register', authController.register)
Route.post('/check/pin', authController.checkingPin)
Route.patch('/pin/create/:userId', authController.createPin)

module.exports = Route
