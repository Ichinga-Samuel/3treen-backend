const mongoose = require('mongoose');
const validator = require('validator');

const logisticsSchema = mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },

  verified: {
    type: String,
    default: false,
  },

  photo: {
    type: String,
    default: 'default.jpg',
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    //An alternative to regex to perform email validation
    validate: [validator.isEmail, 'Please Provide a valid email'],
  },

  address: {
    type: String,
  },

  state: {
    type: String,
    lowercase: true
  },

  phone: {
    type: Number,
  },

  enabled: {
    type: Boolean,
    default: true,
  },

  rating: {
    type: {
      count: {type: Number, default: 0},
      average: {type: Number, default: 0}
    }
  },
});

module.exports = mongoose.model('Logistics', logisticsSchema);
