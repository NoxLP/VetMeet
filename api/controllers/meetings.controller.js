const meetingsModel = require('../models/meetings.model')
const clinicsModel = require('../models/clinics.model')
const patientsModel = require('../models/patients.model')
const { handleError } = require('../utils')

module.exports = {
  getDateDTOs,
  createMeeting,
  deleteMeeting
}

function getDateDTOs(req, res) {
  console.log('getDateDTOs')

  meetingsModel.find({}, { date: 1, _id: 0 })
    .limit(req.query.limit)
    .skip(req.query.page * req.query.limit)
    .then(response => {
      console.log('ok')
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(400).json(err)
    })
}

async function createMeeting(req, res) {
  console.log('createMeeting')

  try {
    let { name, patientId, species, history, date, disease } = req.body

    let data = await Promise.all([
      clinicsModel.findOne({ email: res.locals.clinic.email }),
      patientId ? patientsModel.findById(patientId) : patientsModel.create({ name, species, history })
    ])
    let [clinic, patient] = data
    console.log(clinic, patient)

    let meetingData = { date, disease }
    meetingData['clinic'] = clinic._id
    meetingData['patient'] = patient._id
    let meeting = await meetingsModel.create(meetingData)
    console.log(meeting)

    if (!patientId) {
      clinic.patients.push(patient._id)
      patient.clinics.push(clinic._id)

      await Promise.all([clinic.save(), patient.save()])
    } else {
      if (patient.name !== name) patient.name = name
      if (patient.species !== species) patient.species = species
      if (patient.history !== history) patient.history = history
      if (!clinic.patients.includes(patient._id)) clinic.patients.push(patient._id)
      clinic.meetings.push(meeting._id)

      await Promise.all([clinic.save(), patient.save()])
    }

    res.status(200).json(meeting)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}

async function deleteMeeting(req, res) {
  console.log('deleteMeeting')

  try {
    let data = await Promise.all([
      meetingsModel.findById(req.params.meetingId),
      clinicsModel.findOne({ email: res.locals.clinic.email })
    ])
    let [meeting, clinic] = data
    
    let patient = await patientsModel.findById(meeting.patient)
    let remove = meetingsModel.findByIdAndRemove(req.params.meetingId)
    
    clinic.meetings.splice(clinic.meetings.findIndex(x => x === req.params.meetingId), 1)
    patient.meetings.splice(patient.meetings.findIndex(x => x === req.params.meetingId), 1)
    await Promise.all([clinic.save(), patient.save()])
    await remove

    res.status(200).json(meeting)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}