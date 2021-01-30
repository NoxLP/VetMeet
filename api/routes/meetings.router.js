const router = require('express').Router()
const { 
  authUser,
  authClinic,
  authUserOrClinic
} = require('../utils') // Authenticated Route

const {
  getDateDTOs,
  getFilterDTOs,
  getMeeting,
  updateMeeting,
  createMeeting,
  deleteMeeting
} = require('../controllers/meetings.controller')

router
  .get('/dtos/date', authUserOrClinic, getDateDTOs)
  .get('/dtos/filter', authClinic, getFilterDTOs)
  .get('/:meetingId', authUserOrClinic, getMeeting)

router
  .put('/:meetingId', authClinic, updateMeeting)

router
  .post('/', authClinic, createMeeting)

router
  .delete('/:meetingId', authClinic, deleteMeeting)

module.exports = router