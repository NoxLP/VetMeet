const router = require('express').Router()
const { 
  signUp,
  login
} = require('../controllers/auth.controller')

router
  .post('/signup', signUp) //body => {name, email, password}
  .post('/login', login)

module.exports = router