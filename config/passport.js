const { Strategy } = require('passport-jwt')
const { secretOrKey } = require('./keys')
const User = require('../models/User')

const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies) {
    token = req.cookies.jwt
  }
  return token
}

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey,
}

module.exports = (passport) => {
  passport.use(new Strategy(opts, (payload, done) => {
    User.findById({ _id: payload.id }, (err, user) => {
      if (err) {
        return done(err, false)
      }
      if (user) {
        return done(null, user)
      }
      return done(null, false)
    })
  }))
}
