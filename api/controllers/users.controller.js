const usersModel = require('../models/users.model')
const { handleError } = require('../utils')

module.exports = {
  getAllUsers,
  getUserById,
  getMe,
  deleteUserById,
  updateMe,
  updateUserById
}

const getUserAccesibleData = (user, includeId = false) => {
  const data = { 
    name: user.name, 
    email: user.email, 
    role: user.role,
    createdAt: new Date(user.createdAt).toLocaleDateString()
  }
  if(includeId) 
    data['id'] = user._id

  return data
}

function getAllUsers(req, res) {
  usersModel
    .find()
    .then(response => res.status(200).json(response.map(x => getUserAccesibleData(x, true))))
    .catch((err) => handleError(err, res))
}

function getUserById(req, res) {
  usersModel
    .findById(req.params.userId)
    .then(response => res.status(200).json(response))
    .catch((err) => handleError(err, res))
}

function getMe(req, res) {
  console.log('me controller')
  usersModel
    .findOne({ email: res.locals.user.email })
    .then(response => {
      console.log('ok', response)
      res.status(200).json(getUserAccesibleData(response))
    })
    .catch((err) => handleError(err, res))
}

function deleteUserById(req, res) {
  usersModel
    .remove({ _id: req.params.userId })
    .then(response => res.status(200).json(response))
    .catch(err => handleError(err, res))
}

function updateMe(req, res) {
  //TODO: USBAT change own password
  if(req.body.hasOwnProperty('password')) { 
    res.status(500).send('not implemented yet')
  }
  usersModel
    .findOneAndUpdate({ email: res.locals.user.email }, req.body, {
      new: true,
      runValidators: true
    })
    .then(response => res.status(200).json(getUserAccesibleData(response)))
    .catch((err) => handleError(err, res))
}

function updateUserById(req, res) {
  usersModel
    .findByIdAndUpdate({ _id: req.params.userId }, req.body, {
      new: true,
      runValidators: true
    })
    .then(response => res.status(200).json(getUserAccesibleData(response)))
    .catch((err) => handleError(err, res))
}