const usersModel = require('../models/users.model')
const ClinicModel = require('../models/clinics.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { handleError } = require('../utils')

module.exports = { 
  usersSignUp,
  usersLogin,
  clinicsLogin,
  clinicsSignUp
}

function usersSignUp(req, res) {
  const encryptedPwd = bcrypt.hashSync(req.body.password, 10)
  console.log(req.body)
  usersModel.create({
    name: req.body.name,
    email: req.body.email,
    password: encryptedPwd,
    role: req.body.role
  })
    .then(user => {
      const data = { email: user.email, name: user.name }
      const token = jwt.sign(data, process.env.SECRET, { expiresIn: '24h' })
      
      res.status(200).json({ token: token, ...data })
    })
    .catch(err => res.status(500).json(err))
}
function usersLogin(req, res) {
  usersModel.findOne({ email: req.body.email })
    .then(user => {
      if(!user) 
        return res.status(400).json({ error: 'wrong password or email' })

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if(!result) {
          return res.status(500).json({ error: 'wrong password or email' })
        }

        const user_data = { username: req.body.name, email: req.body.email }
        const token = jwt.sign(user_data, process.env.SECRET, { expiresIn: '24h' })

        return res.status(200).json({ token: token, ...user_data })
      })
    })
    .catch(err => handleError(err, res))
}
function clinicsSignUp(req, res) {
  const encryptedPwd = bcrypt.hashSync(req.body.password, 10)
  console.log(req.body)
  const clinic = {
    name: req.body.name,
    email: req.body.email,
    password: encryptedPwd,
    address: req.body.address,
    telephone: req.body.telephone
  }
  if (req.body.hasOwnProperty('contactPerson'))
    clinic['contactPerson'] = req.body.contactPerson

  ClinicModel.create(clinic)
    .then(user => {
      const data = { email: user.email, name: user.name }
      const token = jwt.sign(data, process.env.SECRET, { expiresIn: '24h' })
      
      res.status(200).json({ token: token, ...data })
    })
    .catch(err => res.status(500).json(err))
}
function clinicsLogin(req, res) {
  ClinicModel.findOne({ email: req.body.email })
    .then(clinic => {
      if(!clinic) 
        return res.status(400).json({ error: 'wrong password or email' })

      bcrypt.compare(req.body.password, clinic.password, (err, result) => {
        if(!result) {
          return res.status(500).json({ error: 'wrong password or email' })
        }

        const clinic_data = { name: req.body.name, email: req.body.email }
        const token = jwt.sign(clinic_data, process.env.SECRET, { expiresIn: '24h' })

        return res.status(200).json({ token: token, ...clinic_data })
      })
    })
    .catch(err => handleError(err, res))
}