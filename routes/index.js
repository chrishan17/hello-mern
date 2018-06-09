const express = require('express')
const users = require('./users')
const posts = require('./posts')
const profile = require('./profile')

const router = express.Router()

router.use('/users', users)

router.use('/posts', posts)

router.use('/profile', profile)

module.exports = router
