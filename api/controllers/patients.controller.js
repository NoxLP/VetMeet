const clinicsModel = require('../models/clinics.model')
const patientsModel = require('../models/patients.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { handleError } = require('../utils')

module.exports = {
  getPatientsDTOs,
  createPatient
}

function getPatientsDTOs(req, res) {
  console.log('get patients DTOs')
  //revisar esto, creo q en el query son todo strings, por eso el parseInt
  const limit = parseInt(req.query.limit)
  const page = req.query.page ? parseInt(req.query.page) : 0
  const populateConfig = {
    path: 'patients',
    select: 'name species history createdAt'
  }

  if (limit && limit > 0) {
    populateConfig['options'] = {
      'limit': limit,
      skip: page * limit
    }
  }

  clinicsModel.findOne({ email: res.locals.clinic.email })
    .populate(populateConfig)
    .then(response => {
      console.log('found clinic with patients: ', response)
      res.status(200).json(response.patients)
    })
    .catch(err => {
      console.log('error: ', err)
      res.status(400).json(err)
    })
}

async function createPatient(req, res) {
  console.log('create patient: ', req.body)

  let patient;
  try {
    patient = patientsModel.create(req.body)
    let clinic = await clinicsModel.findOne({ email: res.locals.clinic.email })

    patient = await patient
    patient.clinics.push(clinic._id)
    await patient.save()
    console.log('patient post: ', patient)
    
    clinic.patients.push(patient._id)
    console.log('clinic post: ', clinic)
    await clinic.save()

    return res.status(200).json(patient)
  } catch(err) {
    console.log(err)
    return res.status(400).json(err)
  }
}