const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['admin', 'user'],
    required: true
  },
  createdAt: { type: Number, default: Date.now() /* Get a timestamp :)*/ }
})

const usersModel = mongoose.model('users', userSchema)
module.exports = usersModel
