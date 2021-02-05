const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const messageSchema = mongoose.Schema({
  body: {
    type: String,
    required: [true, 'A message must have a body'],
    trim: true,
  },

  sender: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'A message must have a sender'],
    ref: 'User',
  },

  senderId: {
    type: String,
  },

  recieverId: {
    type: String,
  },

  reciever: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'A message must have a receiver'],
    ref: 'User',
  },

  read: {
    type: Boolean,
    default: false,
  },

  roomId: {
    type: String,
  },

  timeStamp: {
    type: Date,
    default: Date.now(),
  },
});

//DOCUMENT MIDDLEWARE
messageSchema.pre('save', async function (next) {
  this.senderId = this.sender;
  this.recieverId = this.reciever;

  const messages = await this.constructor.find({
    $or: [
      { recieverId: this.recieverId, senderId: this.senderId },
      { senderId: this.recieverId, recieverId: this.senderId },
    ],
  });

  if (messages.length > 0 && messages[0].roomId) {
    this.roomId = messages[0].roomId;
  } else {
    this.roomId = uuidv4();
  }

  next();
});

module.exports = mongoose.model('Message', messageSchema);
