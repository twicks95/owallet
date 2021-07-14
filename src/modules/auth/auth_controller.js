const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const authModel = require('./auth_model')
const userModel = require('../user/user_model')
const wrapper = require('../../helpers/wrapper')
const balanceModel = require('../balance/balance_model')
require('dotenv').config()

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

        // Send email for verify account
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_EMAIL, // generated ethereal user
            pass: process.env.SMTP_PASSWORD // generated ethereal password
          }
        })

        const mailOptions = await transporter.sendMail({
          from: '"Owallet" <owallet.co@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: 'Owallet - Email account activation', // Subject line
          html: `<a href="http://${process.env.DB_HOST}:${process.env.DB_PORT}/api/v1/auth/account/activate/${result.id}">Click this link</a><b> to activate your account.</b>` // html body
        })

        transporter.sendMail(mailOptions, function (error, info) {
          if (!error) {
            // console.log('Email sent: ' + info.response)
            return wrapper.response(res, 200, 'Success Register User')
          } else {
            // console.log(error)
            return wrapper.response(res, 400, 'Failed To Send Email')
          }
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
  },

  updateAccountStatus: async (req, res) => {
    try {
      const { id } = req.params
      const result = await userModel.updateUser({ user_verified: 1 }, id)
      return wrapper.response(res, 200, 'Success Update Account Status', result)
    } catch (error) {
      return wrapper.response(res, 400, 'Bad Request', error)
    }
  }
}
