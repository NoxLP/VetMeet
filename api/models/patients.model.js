const mongoose = require('mongoose')

const patientsSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], maxLength: 128 },
  species: { type: String, required: [true, 'Species is required'], maxLength: 128 },
  history: String,
  clinics: [{type: mongoose.Schema.Types.ObjectId, ref: 'clinics'}],
  meetings: [{type: mongoose.Schema.Types.ObjectId, ref: 'meetings'}]
})

module.exports = mongoose.model('patients', patientsSchema)