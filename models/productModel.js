const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },

  price: { type: Number, required: true },

  images: [String],

  description: {
    type: String,
    required: [true, 'A product must have a description'],
    trim: true,
  },

  keyFeatures: {
    type: String,
    required: [true, 'A product must have key features'],
    trim: true,
  },

  specification: {
    type: String,
    required: [true, 'A product must have a specification'],
    trim: true,
  },

  category: {
    type: String,
    required: [true, 'A product must have a category'],
    // default: 'Electronics',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Product', productSchema);
