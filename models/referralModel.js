const mongoose = require('mongoose');

const referralSchema = mongoose.Schema({
  salesRep: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'A message must have a sales Rep'],
    ref: 'User',
  },

  user: {
    type: Object,
    required: true,
  },

  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Referral', referralSchema);
