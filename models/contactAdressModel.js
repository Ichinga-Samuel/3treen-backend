const mongoose = require('mongoose');

const adressSchema = new mongoose.Schema({
  address: {
    type: String,
    trim: true,
  },

  city: {
    type: String,
    trim: true,
  },

  state: {
    type: String,
    trim: true,
  },

  country: {
    type: String,
    trim: true,
  },

  postalCode: {
    type: String,
    trim: true,
  },
});

const Address = mongoose.model('Address', adressSchema);

module.exports = Address;
