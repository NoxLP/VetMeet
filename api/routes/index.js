const router = require('express').Router()

const authRouter = require('./auth.router')
const usersRouter = require('./users.router')
const clinicsRouter = require('./clinics.router')
const patientsRouter = require('./patients.router')
const { authUser } = require('../utils') // Authenticated Route

router
  .use('/auth', authRouter)
  .use('/users', usersRouter)
  .use('/clinics', clinicsRouter)
  .use('/patients', patientsRouter)

router.get('/whoami', authUser, (req, res) => {
  res.send(`hi there! ${res.locals.user.name}`)
})

module.exports = router