const router = require('express').Router()
const { 
  authUser,
  authClinic,
  authUserOrClinic
} = require('../utils') // Authenticated Route

const {
  getDateDTOs,
  createMeeting,
  deleteMeeting
} = require('../controllers/meetings.controller')

router
  .get('/dtos/date', authUserOrClinic, getDateDTOs)

router
  .post('/', authClinic, createMeeting)

router
  .delete('/:meetingId', authClinic, deleteMeeting)

module.exports = router