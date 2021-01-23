const router = require('express').Router()
const { authUser } = require('../utils') // Authenticated Route

const {
  
} = require('../controllers/clinics.controller')

router.get('/', authUser, TODOHERE)

module.exports = router