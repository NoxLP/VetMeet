const router = require('express').Router()
const { 
  authUser,
  authClinic,
  authUserOrClinic
} = require('../utils') // Authenticated Route

const {
  getPatientsDTOs,
  createPatient
} = require('../controllers/patients.controller')

router
  .get('/dtos', authClinic, getPatientsDTOs)

router
  .post('/', authUserOrClinic, createPatient)

module.exports = router