const mongoose = require('mongoose');
const Product = require('./productModel');

const cartItemShema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },

  product: {
    type: Object,
  },

  quantity: {
    type: Number,
    default: 1,
  },
});

//DOCUMENT MIDDLEWARE
cartItemShema.pre('save', async function (next) {
  //the "this" keyword points to the current document
  const product = await Product.findById(this.productId);
  this.product = product;
  this.productId = undefined;
  next();
});

module.exports = mongoose.model('CartItem', cartItemShema);
