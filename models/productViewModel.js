const mongoose = require('mongoose');
const Product = require('./productModel');

const productViewSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'A product view must have a product'],
    ref: 'Product',
  },

  viewer: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'A product view must have a user'],
    ref: 'User',
  },

  timeStamp: {
    type: Date,
    default: Date.now(),
  },
});

productViewSchema.statics.calcViews = async function (productId) {
  const views = await this.aggregate([
    {
      $match: { product: productId },
    },

    {
      $group: {
        _id: '$product',
        numViews: { $sum: 1 },
      },
    },
  ]);

  if (views.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      numViews: views[0].numViews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      numViews: 0,
    });
  }
};

productViewSchema.post('save', function () {
  this.constructor.calcViews(this.product);
});

module.exports = mongoose.model('productView', productViewSchema);
