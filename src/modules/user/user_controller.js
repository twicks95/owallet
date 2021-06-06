const bcrypt = require('bcrypt')
const wrapper = require('../../helpers/wrapper')

const userModel = require('./user_model')
const authModel = require('../auth/auth_model')

module.exports = {
  updatePassword: async (req, res) => {
    try {
      const { id } = req.params
      const { currentPassword, newPassword } = req.body

      const userFound = await authModel.getDataConditions({
        user_id: id
      })
      const currentPassCorrect = bcrypt.compareSync(
        currentPassword,
        userFound[0].user_password
      )

      if (userFound.length > 0) {
        if (currentPassCorrect) {
          const salt = bcrypt.genSaltSync(10)
          const encryptedPassword = bcrypt.hashSync(newPassword, salt)

          const result = await userModel.updateUser(
            { user_pin: encryptedPassword },
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
