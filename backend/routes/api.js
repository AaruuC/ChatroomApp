/* eslint-disable linebreak-style */
const express = require('express')

const router = express.Router()
const Chatroom = require('../models/chatroom')
// const Message = require('../models/message')
const isAuthenticated = require('../middlewares/isAuthenticated')

router.get('/chatroom', async (req, res) => {
  const { body } = req
  const { _id } = body
  const chatroom = await Chatroom.find()
  res.json(chatroom)
})

router.post('/chatroom/add', isAuthenticated, async (req, res, next) => {
  try {
    const { body } = req
    const { roomname, password } = body
    const { session } = req
    const { username } = session
    // const newMessage = { message, author: username }
    await Chatroom.create({
      admin: username, roomname, password, users: [username],
    })
    // await Chatroom.updateOne({ _id }, { message: [...newMessage] })
    res.send('chatroom successfully created')
  } catch (e) {
    res.send('chatroom creation failed')
    next(e)
  }
})

router.post('/chatroom/adduser', isAuthenticated, async (req, res, next) => {
  try {
    const { body } = req
    const { user, roomname, password } = body
    const newArr = await Chatroom.find({ roomname })
    if (password === newArr[0].password && !newArr[0].users.includes(user)) {
      const arr = [...newArr[0].users, user]
      await Chatroom.updateOne({ roomname }, { users: arr })
      res.send('user successfully added')
    } else {
      throw new Error('failed to join')
    }
  } catch (e) {
    res.send('failed to add user')
    next(e)
  }
})

router.post('/chatroom/message', isAuthenticated, async (req, res, next) => {
  const { body } = req
  const { _id, message } = body
  const { session } = req
  const { username } = session
  try {
    const newMessage = { message, author: username }
    const newArr = await Chatroom.find({ _id })
    const arr = [...newArr[0].messages, newMessage]
    await Chatroom.updateOne({ _id }, { messages: arr })
    res.send('message sent')
  } catch (e) {
    res.send('message failed to send')
    next(e)
  }
})

module.exports = router
