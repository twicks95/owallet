const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authModel = require('./auth_model')
const balanceModel = require('../balance/balance_model')
const wrapper = require('../../helpers/wrapper')

module.exports = {
  login: async (req, res) => {
    try {
      const { userEmail, userPassword } = req.body
      const emailFound = await authModel.getDataConditions({
        user_email: userEmail
      })

      if (emailFound.length > 0) {
        const passwordMatch = bcrypt.compareSync(
          userPassword,
          emailFound[0].user_password
        )

        if (passwordMatch) {
          const payload = emailFound[0]
          delete payload.user_password

          const token = jwt.sign({ ...payload }, 'RAHASIA', {
            expiresIn: '48h'
          })

          const result = { ...payload, token }
          return wrapper.response(res, 200, 'Login success', result)
        } else {
          return wrapper.response(res, 401, 'Incorrect password!')
        }
      } else {
        return wrapper.response(res, 404, 'Email is not registered!')
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },

  register: async (req, res) => {
    try {
      const { userName, userEmail, userPhone, userPassword } = req.body

      const emailIsRegistered = await authModel.getDataConditions({
        user_email: userEmail
      })
      if (emailIsRegistered.length > 0) {
        return wrapper.response(
          res,
          409,
          'An email that you are trying to register is already exist.'
        )
      } else {
        const salt = bcrypt.genSaltSync(10)
        const encryptedPassword = bcrypt.hashSync(userPassword, salt)
        const setData = {
          user_name: userName,
          user_email: userEmail,
          user_phone: userPhone,
          user_password: encryptedPassword
        }
        const result = await authModel.postData(setData)
        delete result.user_password

        // Set default balance
        await balanceModel.postBalance({
          user_id: result.id,
          balance: '0'
        })

        return wrapper.response(res, 200, 'Success create user account', result)
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },

  checkingPin: async (req, res) => {
    try {
      const { pin, userPin } = req.body
      const pinMatch = bcrypt.compareSync(pin, userPin)
      if (pinMatch) {
        return wrapper.response(res, 200, 'Correct PIN')
      } else {
        return wrapper.response(res, 401, 'Incorrect PIN!')
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },

  createPin: async (req, res) => {
    try {
      const { userId } = req.params
      const { userPin } = req.body

      const userFound = await authModel.getDataConditions({
        user_id: userId
      })

      if (userFound.length > 0) {
        const salt = bcrypt.genSaltSync(10)
        const encryptedPIN = bcrypt.hashSync(userPin, salt)

        const result = await authModel.updatePin(
          { user_pin: encryptedPIN },
          userId
        )
        delete result.user_pin
        return wrapper.response(res, 200, 'Success create user PIN', result)
      } else {
        return wrapper.response(
          res,
          404,
          'Failed to create PIN, no user found!'
        )
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  }
}
