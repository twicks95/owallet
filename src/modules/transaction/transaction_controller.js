const wrapper = require('../../helpers/wrapper')
const transactionModel = require('./transaction_model')
const balanceModel = require('../balance/balance_model')
const ejs = require('ejs')
const pdf = require('html-pdf')
// const path = require('path')

module.exports = {
  getIncome: async (req, res) => {
    try {
      const { id } = req.params
      const result = await transactionModel.getIncome(id)
      return wrapper.response(res, 200, 'Success get income', result)
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },
  getExpense: async (req, res) => {
    try {
      const { id } = req.params
      const result = await transactionModel.getExpense(id)
      return wrapper.response(res, 200, 'Success get expense', result)
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },
  getTransaction: async (req, res) => {
    try {
      const { id, by } = req.query
      let { limit } = req.query

      if (!limit) {
        limit = 5
      } else {
        limit = parseInt(limit)
      }

      let queryCondition
      if (by === 'week') {
        queryCondition = 'AND WEEK(transaction_created_at) = WEEK(NOW())'
      } else if (by === 'month') {
        queryCondition = 'AND MONTH(transaction_created_at) = MONTH(NOW())'
      } else if (by === 'all') {
        queryCondition = ''
      }

      let message
      if (by === 'week') {
        message = 'Success get transaction data by week'
      } else if (by === 'month') {
        message = 'Success get transaction data by month'
      } else {
        message = 'Success get all transaction data'
      }

      const result = await transactionModel.getTransaction(
        id,
        queryCondition,
        limit
      )
      if (result.length > 0) {
        return wrapper.response(res, 200, message, result)
      } else {
        return wrapper.response(res, 404, 'No transaction data', result)
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },
  createTransaction: async (req, res) => {
    try {
      const { receiverId, senderId, amount, notes } = req.body
      const setData = {
        transaction_sender_id: senderId,
        transaction_receiver_id: receiverId,
        transaction_amount: amount,
        transaction_notes: notes,
        transaction_type: 'transfer',
        transaction_status: 'success'
      }
      const result = await transactionModel.postTransaction(setData)

      if (result) {
        // Update receiver balance
        const receiverBalance = await balanceModel.getBalance(receiverId)
        const newReceiverBalance = receiverBalance[0].balance + parseInt(amount)
        await balanceModel.updateBalance(
          {
            balance: newReceiverBalance,
            balance_updated_at: new Date(Date.now())
          },
          receiverId
        )
        // Update sender balance
        const senderBalance = await balanceModel.getBalance(senderId)
        const newSenderBalance = senderBalance[0].balance - parseInt(amount)
        await balanceModel.updateBalance(
          {
            balance: newSenderBalance,
            balance_updated_at: new Date(Date.now())
          },
          senderId
        )

        return wrapper.response(res, 200, 'Success create transaction', result)
      } else {
        return wrapper.response(res, 402, 'Failed!', result)
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },
  getTotalTransactionPerDay: async (req, res) => {
    try {
      const { id } = req.params
      const result = await transactionModel.getTotalTransactionPerDay(id)
      return wrapper.response(res, 200, 'Success', result)
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },
  exportTransaction: async (req, res) => {
    try {
      const { id } = req.params
      const fileName = `transfer-report-${id}.pdf`
      const result = await transactionModel.getDataById(id)

      ejs.renderFile(
        'src/templates/report-transfer-template.ejs',
        { result },
        (err, data) => {
          if (err) {
            return wrapper.response(res, 400, 'Export failed 1', err)
          } else {
            const options = {
              height: '11.25in',
              width: '8.5in',
              header: {
                height: '20mm'
              },
              footer: {
                height: '20mm'
              }
            }
            pdf
              .create(data, options)
              .toFile('public/transfer/' + fileName, function (err, data) {
                if (err) {
                  return wrapper.response(res, 400, 'Export failed 2', err)
                } else {
                  return wrapper.response(res, 200, 'Export PDF success', {
                    url: `${process.env.DB_HOST}:${process.env.DB_PORT}/api/${fileName}`
                  })
                }
              })
          }
        }
      )
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  }
}
