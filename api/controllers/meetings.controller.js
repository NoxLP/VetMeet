const meetingsModel = require('../models/meetings.model')
const clinicsModel = require('../models/clinics.model')
const patientsModel = require('../models/patients.model')
const { handleError } = require('../utils')

module.exports = {
  getDateDTOs
}

function getDateDTOs(req, res) {
  console.log('getDateDTOs')
  
  meetingsModel.find({}, { date: 1 })
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