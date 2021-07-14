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
        return wrapper.response(res, 200, 'Success get user', result)
      } else {
        return wrapper.response(res, 404, `Cannot find user with ID ${id}`)
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },

  getUsers: async (req, res) => {
    try {
      let { page, limit, searchByPhone, sort } = req.query
      page = !page ? '1' : page
      limit = !limit ? '5' : limit
      searchByPhone = !searchByPhone ? '' : searchByPhone
      sort = !sort ? 'user_id ASC' : sort

      page = parseInt(page)
      limit = parseInt(limit)
      let offset = 0
      offset = page * limit - limit

      const totalData = await userModel.getDataCount(searchByPhone)
      const totalPage = Math.ceil(totalData / limit)

      const result = await userModel.getUsers(
        searchByPhone,
        sort,
        limit,
        offset
      )
      if (result.length > 0) {
        return wrapper.response(res, 200, 'Success get users', result, {
          page,
          totalPage,
          limit,
          totalData,
          offset
        })
      } else {
        return wrapper.response(res, 404, 'User not found', null)
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },

  getUserByPhone: async (req, res) => {
    try {
      const { userPhone } = req.query
      const result = await userModel.getUserByPhone(userPhone)
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

  updateUserName: async (req, res) => {
    try {
      const { id } = req.params
      const { userName } = req.body

      const dataToUpdate = await userModel.getUser(id)
      if (dataToUpdate.length > 0) {
        const result = await userModel.updateUser(
          {
            user_name: userName,
            user_updated_at: new Date(Date.now())
          },
          id
        )
        return wrapper.response(res, 200, 'Success update name', result)
      } else {
        return wrapper.response(res, 404, 'Failed! No data is updated')
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },

  updateUserPhone: async (req, res) => {
    try {
      const { id } = req.params
      const { userPhone } = req.body

      const dataToUpdate = await userModel.getUser(id)
      if (dataToUpdate.length > 0) {
        const result = await userModel.updateUser(
          {
            user_phone: userPhone,
            user_updated_at: new Date(Date.now())
          },
          id
        )
        return wrapper.response(res, 200, 'Success update phone number', result)
      } else {
        return wrapper.response(res, 404, 'No user data updated')
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
            'Failed to update password, incorrect current password!'
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
  },

  deleteImage: async (req, res) => {
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
            user_image: '',
            user_updated_at: new Date(Date.now())
          },
          id
        )
        return wrapper.response(res, 200, 'Success Delete User Image', result)
      } else {
        return wrapper.response(res, 404, 'Failed! No Data Is Deleted')
      }
    } catch (error) {
      return wrapper.response(res, 400, 'Bad Request', error)
    }
  }
}
