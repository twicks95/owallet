const express = require('express')
const Route = express.Router()
const balanceController = require('./balance_controller')
// const authMiddleware = require('../../middleware/auth')

// Route.get('/:id', balanceController.getBalance)
Route.patch('/', balanceController.updateBalance)

module.exports = Route
