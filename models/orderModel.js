const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  cart: {
    type: Array,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  totalCost: {
    type: Number,
    required: [true, 'An order must have a total cost'],
  },

  quantity: { type: Number, default: 1 },

  state: {
    type: String,
    required: true,
    trim: true,
  },

  LGA: {
    type: String,
    required: true,
    trim: true,
  },

  phoneNumber: {
    type: Number,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);
