const mongoose = require('mongoose')

const meetingsSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: [true, 'Date is required'], 
    unique: [true, "There's a meeting already at this date"] 
  },
  disease: { type: String, required: [true, 'Disease is required'], maxLength: 128  },
  surgery: { type: String, maxLength: 128  },
  treatment: String,
  notes: String,
  done: { type: Boolean, default: false},
  confirmed: { type: Boolean, default: false},
  clinic: {type: mongoose.Schema.Types.ObjectId, required: [true, 'Clinic is required']},
  patient: {type: mongoose.Schema.Types.ObjectId, required: [true, 'Patient is required']},
  createdAt: { type: Number, default: Date.now() /* Get a timestamp :)*/ }
  
})

module.exports = mongoose.model('meetings', meetingsSchema)