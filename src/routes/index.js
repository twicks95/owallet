const express = require('express')
const Route = express.Router()
const authRouter = require('../modules/auth/auth_routes')
const userRouter = require('../modules/user/user_routes')
const transactionRouter = require('../modules/transaction/transaction_routes')
const balanceRouter = require('../modules/balance/balance_routes')
const topupRouter = require('../modules/topup/topup_routes')

Route.use('/auth', authRouter)
Route.use('/user', userRouter)
Route.use('/balance', balanceRouter)
Route.use('/transaction', transactionRouter)
Route.use('/topup', topupRouter)

module.exports = Route
