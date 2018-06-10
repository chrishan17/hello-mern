const express = require('express')
const passport = require('passport')

const router = express.Router()

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  })
})

module.exports = router
