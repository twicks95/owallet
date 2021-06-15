const wrapper = require('../../helpers/wrapper')
const topupModel = require('./topup_model')
const balanceModel = require('../balance/balance_model')

module.exports = {
  createTopup: async (req, res) => {
    try {
      const { id } = req.params
      const { amount } = req.body
      const setData = {
        topup_user_id: id,
        topup_amount: amount,
        topup_method: 'ATM Transfer',
        topup_status: 'success'
      }
      const result = await topupModel.postTopup(setData)

      const balance = await balanceModel.getBalance(id)
      const newBalance = balance[0].balance + parseInt(amount)
      await balanceModel.updateBalance(
        {
          balance: newBalance,
          balance_updated_at: new Date(Date.now())
        },
        id
      )
      return wrapper.response(res, 200, 'Success topup', result)
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  }
}
