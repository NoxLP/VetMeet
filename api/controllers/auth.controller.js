const UserModel = require('../models/users.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { handleError } = require('../utils')

module.exports = { 
  signUp,
  login
}

function signUp(req, res) {
  const encryptedPwd = bcrypt.hashSync(req.body.password, 10)
  console.log(req.body)
  UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: encryptedPwd
  })
  .then(user => {
    const data = { email: user.email, name: user.name }
    const token = jwt.sign(data, process.env.SECRET, { expiresIn: '24h' })
    
    res.status(200).json({ token: token, ...data })
  })
  .catch(err => res.status(500).json(err))
}
function login(req, res) {
  UserModel.findOne({ email: req.body.email })
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