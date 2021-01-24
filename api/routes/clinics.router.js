const router = require('express').Router()
const { 
  authUser,
  authClinic,
  authUserOrClinic
} = require('../utils') // Authenticated Route

const {
  getMe,
  updateMe
} = require('../controllers/clinics.controller')

router
  //.get('/', authUser, TODOHERE)
  .get('/me', authClinic, getMe)

router
  .put('/me', authClinic, updateMe)

module.exports = router