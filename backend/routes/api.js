/* eslint-disable linebreak-style */
const express = require('express')

const router = express.Router()
const Chatroom = require('../models/chatroom')
const isAuthenticated = require('../middlewares/isAuthenticated')

router.get('/questions', async (req, res) => { // change address
  const questions = await Chatroom.find()
  res.json(questions)
})

router.post('/questions/add', isAuthenticated, async (req, res, next) => { // change address
  try {
    const { body } = req
    const { questionText } = body
    const { session } = req
    const { username } = session
    await Chatroom.create({ questionText, author: username })
    res.send('question successfully submitted')
  } catch (e) {
    res.send('question failed to submit')
    next(e)
  }
})

router.post('/questions/answer', isAuthenticated, async (req, res, next) => { // change address
  const { body } = req
  const { _id, message } = body
  try {
    await Chatroom.updateOne({ _id }, { message })
    res.send('message sent')
  } catch (e) {
    res.send('message failed to send')
    next(e)
  }
})

module.exports = router
