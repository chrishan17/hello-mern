const express = require('express')
const register = require('./register')
const login = require('./login')
const current = require('./current')

const router = express.Router()

router.use('/register', register)
router.use('/login', login)
router.use('/current', current)

module.exports = router
