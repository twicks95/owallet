const express = require('express')
const Route = express.Router()
const userController = require('./user_controller')
// const authMiddleware = require('../../middleware/auth')
const uploadImage = require('../../middleware/uploads')

Route.get('/phone', userController.getUserByPhone)
Route.get('/:id', userController.getUser)
Route.patch('/:id', userController.updateData)
Route.patch('/password/update/:id', userController.updatePassword)
Route.patch(
  '/update/image/:id',
  // authMiddleware.authentication,
  uploadImage,
  userController.updateImage
)

module.exports = Route
