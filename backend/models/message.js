/* eslint-disable linebreak-style */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const messageSchema = new Schema({
  author: { type: String },
  message: { type: String },
})

const Message = model('Chatroom', messageSchema)

module.exports = Message
