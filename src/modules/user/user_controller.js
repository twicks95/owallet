const fs = require('fs')
const bcrypt = require('bcrypt')
const wrapper = require('../../helpers/wrapper')
const userModel = require('./user_model')

module.exports = {
  getUser: async (req, res) => {
    try {
      const { id } = req.params
      const result = await userModel.getUser(id)
      if (result.length > 0) {
        return wrapper.response(res, 200, 'Success get user by ID', result)
      } else {
        return wrapper.response(res, 404, `Cannot find user with ID ${id}`)
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },

  getUserByPhone: async (req, res) => {
    try {
      const { userPhone } = req.query
      const result = await userModel.getUserByPhone({ user_phone: userPhone })
      if (result.length > 0) {
        delete result[0].user_password
        return wrapper.response(res, 200, 'Success get user by phone', result)
      } else {
        return wrapper.response(
          res,
          404,
          `Cannot find user with phone number ${userPhone}`
        )
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },

  updateData: async (req, res) => {
    try {
      const { id } = req.params
      const { firstName, lastName } = req.body

      const userFound = await userModel.getUser(id)
      if (userFound.length > 0) {
        const setData = {
          user_name: `${firstName} ${lastName}`
        }
        const result = await userModel.updateUser(setData, id)
        return wrapper.response(
          res,
          200,
          'Success update user data information',
          result
        )
      } else {
        return wrapper.response(
          res,
          404,
          'Failed to update password, no user found!'
        )
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },

  updateImage: async (req, res) => {
    try {
      const { id } = req.params

      const dataToUpdate = await userModel.getUser(id)
      if (dataToUpdate.length > 0) {
        const imageToDelete = dataToUpdate[0].user_image
        const isImageExist = fs.existsSync(`src/uploads/${imageToDelete}`)

        if (isImageExist && imageToDelete) {
          fs.unlink(`src/uploads/${imageToDelete}`, (err) => {
            if (err) throw err
          })
        }

        const result = await userModel.updateUser(
          {
            user_image: req.file ? req.file.filename : '',
            user_updated_at: new Date(Date.now())
          },
          id
        )
        return wrapper.response(res, 200, 'Success Update User Image', result)
      } else {
        return wrapper.response(res, 404, 'Failed! No Data Is Updated')
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad Request', error)
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { id } = req.params
      const { currentPassword, newPassword } = req.body

      const userFound = await userModel.getUser(id)
      const currentPassCorrect = bcrypt.compareSync(
        currentPassword,
        userFound[0].user_password
      )

      if (userFound.length > 0) {
        if (currentPassCorrect) {
          const salt = bcrypt.genSaltSync(10)
          const encryptedPassword = bcrypt.hashSync(newPassword, salt)

          const result = await userModel.updateUser(
            { user_password: encryptedPassword },
            id
          )
          delete result.user_password
          return wrapper.response(
            res,
            200,
            'Success update user password',
            result
          )
        } else {
          return wrapper.response(
            res,
            401,
            'Failed to update password, your current password is incorrect!'
          )
        }
      } else {
        return wrapper.response(
          res,
          404,
          'Failed to update password, no user found!'
        )
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  }
}
