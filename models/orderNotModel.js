const mongoose = require('mongoose');

const orderNotSchema = mongoose.Schema({
  message: {
    type: String,
    required: [true, 'A Notification must have a body'],
  },

  read: {
    type: Boolean,
    default: false,
  },

  timeStamp: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('orderNotification', orderNotSchema);
