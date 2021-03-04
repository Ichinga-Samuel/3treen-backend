const mongoose = require('mongoose');
const { bool } = require('sharp');
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

  ordered: {
    type: Boolean,
    default: false,
  },

  productUploader: {
    type: String,
  },

  totalPrice: {
    type: Number,
  },

  datePurchased: {
    type: Date,
  },
});

//DOCUMENT MIDDLEWARE
cartItemShema.pre('save', async function (next) {
  //the "this" keyword points to the current document
  const product = await Product.findById(this.productId);
  this.product = product;
  this.productUploader = this.product.uploader;
  this.totalPrice = this.product.price * this.quantity;
  next();
});

module.exports = mongoose.model('CartItem', cartItemShema);
