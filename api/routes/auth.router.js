const router = require('express').Router()
const { 
  usersSignUp,
  usersLogin,
  clinicsSignUp,
  clinicsLogin,
  clinicsGoogleLogin
} = require('../controllers/auth.controller')
const { 
  authAdmin
} = require('../utils') // Authenticated Route

router
  .post('/users/signup', authAdmin, usersSignUp) //body => {name, email, password}
  .post('/users/login', usersLogin)
  .post('/clinics/signup', clinicsSignUp) //body => {name, email, password}
  .post('/clinics/login', clinicsLogin)
  .post('/clinics/googleLogin', clinicsGoogleLogin)

module.exports = router