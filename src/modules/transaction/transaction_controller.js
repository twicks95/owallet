const wrapper = require('../../helpers/wrapper')
const transactionModel = require('./transaction_model')
const balanceModel = require('../balance/balance_model')

module.exports = {
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
  }
}
