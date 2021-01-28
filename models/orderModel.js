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

  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Delivered'],
  },

  deliveryCode: {
    type: String,
  },
});

//DOCUMENT MIDDLEWARE
orderSchema.pre('save', function (next) {
  //Save total number of products ordered

  this.quantity = this.cart.map((el) => el.quantity).reduce((a, b) => a + b);

  //Get total price of each item for the quantity specified
  const prices = this.cart.map((el) => el.quantity * el.product.price);

  //Save total price for the entire cart
  this.totalCost = prices.reduce((a, b) => a + b);

  next();
});

module.exports = mongoose.model('Order', orderSchema);
