/* eslint-disable linebreak-style */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const chatroomSchema = new Schema({
  admin: { type: String },
  roomname: { type: String, required: true },
  password: { type: String },
  messages: [{ type: Object }],
  users: [{ type: String }],
})

const Chatroom = model('Chatroom', chatroomSchema)

module.exports = Chatroom
