const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const { secretOrKey } = require('../../config/keys')

const router = express.Router()

router.post('/', (req, res) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ email: 'User not found' })
      }
      return bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
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
            res.status(400).json({ password: 'Password incorect' })
          }
        })
        .catch((err) => {
          res.status(500).json({ err: err.message, stack: err.stack })
        })
    })
    .catch((err) => {
      res.status(500)
      res.json({ err: err.message, stack: err.stack })
    })
})

module.exports = router
