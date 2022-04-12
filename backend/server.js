/* eslint-disable linebreak-style */
const mongoose = require('mongoose')
const express = require('express')
const cookieSession = require('cookie-session')
const path = require('path')

const account = require('./routes/account')
const api = require('./routes/api')

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://Aaruu:Xianhan123@cluster0.o6m6t.mongodb.net/test'

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const app = express()

app.use(express.json())

app.use(express.static('dist')) // set the static folder

app.use(cookieSession({
  name: 'session',
  keys: ['pineapple'],

  maxAge: 24 * 60 * 60 * 1000,
}))

app.use('/account', account)
app.use('/api', api)

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
  return next()
}

app.use(errorHandler)

app.get('./favicon.ico', (req, res) => {
  res.status(404).send()
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(3000, () => {
  console.log('listening on 3000')
  console.log('mongoDB is connected')
})
