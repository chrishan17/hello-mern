const express = require('express')
const register = require('./register')
const login = require('./login')
const current = require('./current')

const router = express.Router()

// @route GET /api/users/test
// @desc test users
// @access Public
router.get('/test', (req, res) => {
  res.json({ msg: 'users works' })
})

router.use('/register', register)
router.use('/login', login)
router.use('/current', current)

module.exports = router
