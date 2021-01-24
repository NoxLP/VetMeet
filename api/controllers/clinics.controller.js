const clinicModel = require('../models/clinics.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { handleError } = require('../utils')

module.exports = { 
  getMe,
  updateMe
}

const getUserAccesibleData = (clinic, includeId = false) => {
  const data = { 
    name: clinic.name, 
    email: clinic.email, 
    address: clinic.address,
    telephone: clinic.telephone,
    createdAt: new Date(clinic.createdAt).toLocaleDateString()
  }
  if(clinic.hasOwnProperty('contactPerson'))
    data['contactPerson'] = clinic.contactPerson
  if(includeId) 
    data['id'] = clinic._id

  return data
}

function getMe(req, res) {
  console.log('get me controller')
  clinicModel
    .findOne({ email: res.locals.clinic.email })
    .then(response => {
      console.log('ok', response)
      res.status(200).json(getUserAccesibleData(response))
    })
    .catch((err) => {
      console.log('me not found with error: ' + err)
      handleError(err, res)
    })
}

function updateMe(req, res) {
  console.log()
}