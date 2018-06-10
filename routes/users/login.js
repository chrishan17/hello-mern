const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const loginInputValidator = require('../../validators/users/login')
const { secretOrKey } = require('../../config/keys')

const router = express.Router()

router.post('/', (req, res) => {
  const { errors, isValid } = loginInputValidator(req.body)
  if (!isValid) {
    res.status(400).json(errors)
  }
  const { email, password } = req.body
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        errors.email = 'User not found'
        return res.status(404).json(errors)
      }
      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          res.status(200)
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          }
          jwt.sign(payload, secretOrKey, { expiresIn: '7d' }, (err, token) => {
            res.cookie('jwt', `${token}`)
            res.json({ token: `${token}` })
          })
        } else {
          errors.password = 'Password incorect.'
          res.status(400).json(errors)
        }
      })
    })
    .catch((err) => {
      res.status(500)
      res.json({ err: err.message, stack: err.stack })
    })
})

module.exports = router
