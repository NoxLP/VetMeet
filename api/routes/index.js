const router = require('express').Router()

const authRouter = require('./auth.router')
const usersRouter = require('./users.router')
const clinicsRouter = require('./clinics.router')
const { 
  authUser/*,
  authAdmin,
  authClinic*/
} = require('../utils') // Authenticated Route

router
  .use('/clinics', clinicsRouter)
  .use('/users', usersRouter)
  .use('/auth', authRouter)

router.get('/whoami', authUser, (req, res) => {
  res.send(`hi there! ${res.locals.user.name}`)
})

module.exports = router