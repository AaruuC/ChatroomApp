/* eslint-disable linebreak-style */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const chatroomSchema = new Schema({
  admin: { type: String, required: true },
  roomname: { type: String, required: true },
  password: { type: String },
  messages: { type: String }, // array of strings?
})

const Chatroom = model('Chatroom', chatroomSchema)

module.exports = Chatroom
