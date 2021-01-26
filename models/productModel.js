const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },

  price: { type: Number, required: true },

  image: { type: String, required: [true, 'A product must have an image'] },

  description: {
    type: String,
    required: [true, 'A product must have a description'],
  },

  keyFeatures: {
    type: String,
    required: [true, 'A product must have key features'],
  },

  specification: {
    type: String,
    required: [true, 'A product must have a specification'],
  },
});

module.exports = mongoose.model('Product', productSchema);
