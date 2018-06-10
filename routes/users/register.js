const express = require('express')
const gravatar = require('gravatar')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')

const router = express.Router()
const registerInputValidator = require('../../validators/users/register')

// @route POST /api/users/register
// @desc register user
// @access Public
router.post('/', (req, res) => {
  const { errors, isValid } = registerInputValidator(req.body)
  if (!isValid) {
    res.status(400).json(errors)
  }
  const { name, email, password } = req.body
  User.findOne({ email })
    .then((data) => {
      if (data) {
        errors.email = 'Email existes.'
        return res.status(404).json(errors)
      }

      const avatar = gravatar.url(
        email,
        {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm', // Default
        },
        false,
      )

      const newUser = new User({
        name,
        email,
        password,
        avatar,
      })

      return bcrypt.genSalt(10).then((salt) => {
        bcrypt
          .hash(password, salt)
          .then((hash) => {
            newUser.password = hash
            newUser
              .save()
              .then(user => res.status(200).json(user))
              .catch((err) => {
                res.status(500).json({ err: err.message, stack: err.stack })
              })
          })
          .catch((err) => {
            res.status(500)
            res.json({ err: err.message, stack: err.stack })
          })
      })
    })
    .catch((err) => {
      res.status(500).json({ err: err.message, stack: err.stack })
    })
})

module.exports = router
