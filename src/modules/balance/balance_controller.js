// const fs = require('fs')
// const bcrypt = require('bcrypt')
const wrapper = require('../../helpers/wrapper')
const balanceModel = require('./balance_model')

module.exports = {
  // getBalance: async (req, res) => {
  //   try {
  //     const { id } = req.params
  //     const result = await balanceModel.getBalance(id)
  //     return wrapper.response(res, 200, 'Success get balance', result)
  //   } catch (error) {
  //     return wrapper.response(res, 400, 'Bad request', error)
  //   }
  // },

  updateBalance: async (req, res) => {
    try {
      const { id, newBalance } = req.query
      const result = await balanceModel.updateBalance(
        { balance: newBalance },
        id
      )
      return wrapper.response(res, 200, 'Success update balance', result)
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  }
}
