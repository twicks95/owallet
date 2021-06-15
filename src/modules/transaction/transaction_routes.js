const express = require('express')
const Route = express.Router()
const transactionController = require('./transaction_controller')

Route.post('/', transactionController.createTransaction)

module.exports = Route
