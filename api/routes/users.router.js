const router = require('express').Router()
const { 
  authUser,
  authAdmin
} = require('../utils') // Authenticated Route

const {
  getAllUsers,
  getUserById,
  getMe,
  deleteUserById,
  updateMe,
  updateUserById
} = require('../controllers/users.controller')

router
  .get('/me', authUser, getMe)
  .get('/:userId', authAdmin, getUserById)
  .get('/', authAdmin, getAllUsers)

router
  .put('/me', authUser, updateMe)
  .put('/:userId', authAdmin, updateUserById)

router.delete('/:userId', authAdmin, deleteUserById)

module.exports = router
