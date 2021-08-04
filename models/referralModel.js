const mongoose = require('mongoose');

const referralSchema = mongoose.Schema({
  salesRep: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'A message must have a sales Rep'],
    ref: 'User',
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  salesRepId: {
    type: String,
  },
});

//DOCUMENT MIDDLEWARE
referralSchema.pre('save', async function (next) {
  this.salesRepId = this.salesRep;
  next();
});

module.exports = mongoose.model('Referral', referralSchema);
