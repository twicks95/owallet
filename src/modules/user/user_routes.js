const express = require('express')
const Route = express.Router()
const userController = require('./user_controller')
const authMiddleware = require('../../middleware/auth')
const uploadImage = require('../../middleware/uploads')

Route.get('/all', userController.getUsers)
Route.get(
  '/phone',
  authMiddleware.authentication,
  userController.getUserByPhone
)
Route.get('/:id', authMiddleware.authentication, userController.getUser)
Route.patch(
  '/password/update/:id',
  authMiddleware.authentication,
  userController.updatePassword
)
Route.patch(
  '/update/image/:id',
  authMiddleware.authentication,
  uploadImage,
  userController.updateImage
)
Route.patch(
  '/update/name/:id',
  authMiddleware.authentication,
  userController.updateUserName
)
Route.patch(
  '/update/phone/:id',
  authMiddleware.authentication,
  userController.updateUserPhone
)
Route.delete(
  '/delete/image/:id',
  authMiddleware.authentication,
  userController.deleteImage
)

module.exports = Route
