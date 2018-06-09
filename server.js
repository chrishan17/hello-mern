const express = require('express')
const mongoose = require('mongoose')
const config = require('./config/keys')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

const db = config.mongoURI
mongoose.connect(db).then(
  () => {
    console.log('MongoDB connected')
  },
  (err) => {
    console.log(err)
  },
)

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Server listen on port ${port}`)
})
