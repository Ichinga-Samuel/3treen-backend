const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const productView = require('../models/productViewModel');
const Product = require('../models/productModel');

exports.setUploader = catchAsync(async (req, res, next) => {
  req.body.uploader = req.user.id;

  next();
});

exports.handleView = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  const view = await productView.find({ product: id, viewer: req.user.id });

  if (view.length < 1) {
    await productView.create({
      product: id,
      viewer: req.user.id,
      productUploader: product.uploader,
    });
  }

  next();
});
