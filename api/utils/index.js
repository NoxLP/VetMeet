const jwt = require('jsonwebtoken')
const usersModel = require('../models/users.model')
const ClinicModel = require('../models/clinics.model')

// Authenticate Middleware
function authUser (req, res, next) {
  console.log('authUser')
  if (!req.headers.token) {
    res.status(403).json({ error: 'No Token found' })
  } else {
    jwt.verify(req.headers.token, process.env.SECRET, (err, token) => {
      if (err) { res.status(403).json({ error: 'Token not valid' }) }
      console.log('token: ', token)
      usersModel.findOne({ email: token.email })
        .then(user => {
          res.locals.user = { name: user.name, email: user.email }
          next()
        })
        .catch(err => res.status(404).send('user not found'))
    })
  }
}
function authAdmin (req, res, next) {
  console.log('authAdmin')
  if (!req.headers.token) {
    res.status(403).json({ error: 'No Token found' })
  } else {
    jwt.verify(req.headers.token, process.env.SECRET, (err, token) => {
      if (err) { res.status(403).json({ error: 'Token not valid' }) }
      console.log('token: ', token)
      
      usersModel.findOne({ email: token.email })
        .then(user => {
          console.log('admin then')
          if(user.role === 'admin') {
            console.log('es admin')
            res.locals.user = { name: user.name, email: user.email, role: 'admin' }
            next()
          } else {
            console.log('no es admin')
            res.status(401).send('You need to be authenticated as administrator to access')
            return
          }
        })
        .catch(err => res.status(404).send('user not found'))
    })
  }
}
function authClinic (req, res, next) {
  if (!req.headers.token) {
    res.status(403).json({ error: 'No Token found' })
  } else {
    jwt.verify(req.headers.token, process.env.SECRET, (err, token) => {
      if (err) { res.status(403).json({ error: 'Token not valid' }) }

      ClinicModel.findOne({ email: token.email })
        .then(clinic => {
          res.locals.clinic = { name: clinic.name, email: clinic.email }
          next()
        })
        .catch(err => res.status(404).send('clinic not found'))
    })
  }
}

// Return HTTP error with details in JSON
function handleError (err, res) {
  console.log('error: ', err)
  return res.status(400).json(err)
}

module.exports = {
  authUser,
  authAdmin,
  authClinic,
  handleError
}
