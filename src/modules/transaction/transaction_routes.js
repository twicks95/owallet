const express = require('express')
const Route = express.Router()
const transactionController = require('./transaction_controller')
const authMiddleware = require('../../middleware/auth')

Route.get(
  '/',
  authMiddleware.authentication,
  transactionController.getTransaction
)
Route.get(
  '/total/:id',
  authMiddleware.authentication,
  transactionController.getTotalTransactionPerDay
)
Route.get(
  '/expense/:id',
  authMiddleware.authentication,
  transactionController.getExpense
)
Route.get(
  '/income/:id',
  authMiddleware.authentication,
  transactionController.getIncome
)
Route.post(
  '/',
  authMiddleware.authentication,
  transactionController.createTransaction
)
Route.get(
  '/export/:id',
  authMiddleware.authentication,
  transactionController.exportTransaction
)

module.exports = Route
