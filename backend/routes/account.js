/* eslint-disable linebreak-style */
const express = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated')
const User = require('../models/user')

const router = express.Router()

router.post('/signup', async (req, res, next) => {
  const { body } = req
  const { username, password } = body

  try {
    await User.create({ username, password })
    res.send('user creation was successful')
  } catch (e) {
    res.send('user creation failed')
    next(e)
  }
})

router.post('/login', async (req, res, next) => {
  const { body, session } = req
  const { username, password } = body
  try {
    const user = await User.findOne({ username })
    if (password === user.password) {
      session.username = username
      res.send(`you are logged in as ${username}`)
    } else {
      throw new Error('incorrect username or password')
    }
  } catch (e) {
    res.send('username or password is incorrect')
    next(e)
  }
})

router.post('/logout', isAuthenticated, (req, res) => {
  req.session.username = null
  res.send('logged out')
})

router.get('/logged', (req, res) => {
  const { session } = req
  const { username } = session
  res.json(username)
})

module.exports = router
