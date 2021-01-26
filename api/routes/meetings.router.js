const router = require('express').Router()
const { 
  authUser,
  authClinic,
  authUserOrClinic
} = require('../utils') // Authenticated Route

const {
  getDateDTOs
} = require('../controllers/meetings.controller')

router
  .get('/dtos/date', authUserOrClinic, getDateDTOs)

module.exports = router