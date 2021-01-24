const mongoose = require('mongoose')

const clinicsSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator (value) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)
      }
    },
    unique: [true, 'This email is registered']
  },
  password: { type: String, required: true },
  address: {
    type: String,
    required: [true, 'Address is required'],
    maxlength: 128
  },
  telephone: { type: Number, required: [true, 'Telephone number is required'] },
  contactPerson: { type: String, maxLength: 128 },
  patients: [{type: mongoose.Schema.Types.ObjectId, ref: 'patients'}],
  meetings: [{type: mongoose.Schema.Types.ObjectId, ref: 'meetings'}],
  createdAt: { type: Number, default: Date.now() /* Get a timestamp :)*/ }
})

const clinicsModel = mongoose.model('clinics', clinicsSchema)
module.exports = clinicsModel
