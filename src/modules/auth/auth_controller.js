const wrapper = require('../../helpers/wrapper')
const authModel = require('./auth_model')
// const bcrypt = require('bcrypt')

module.exports = {
  // login: async (req, res) => {
  //   try {
  //     const
  //   } catch (error) {

  //   }
  // },

  register: async (req, res) => {
    try {
      const { userName, userEmail, userPhone } = req.body

      const emailIsRegistered = await authModel.getDataConditions(userEmail)
      if (emailIsRegistered.length > 0) {
        return wrapper.response(res, 409, 'Email Has Been Registered')
      } else {
        const setData = {
          user_name: userName,
          user_email: userEmail,
          user_phone: userPhone
        }
        const result = await authModel.postData(setData)
        return wrapper.response(res, 200, 'Success Create User Account', result)
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad Request', error)
    }
  }
}
