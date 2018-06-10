const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')

const config = require('./config/keys')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

// DB config
const db = config.mongoURI
mongoose.connect(db).then(
  () => {
    console.log('MongoDB connected')
  },
  (err) => {
    console.log(err)
  },
)

// body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// cookie parser
app.use(cookieParser())

// passport config
app.use(passport.initialize())
require('./config/passport')(passport)

app.get('/', (req, res) => {
  res.send('Hello World')
})

// API route
app.use('/api', routes)

app.listen(port, () => {
  console.log(`Server listen on port ${port}`)
})
