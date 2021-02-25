const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const productView = require('../models/productViewModel');

exports.handleView = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const view = await productView.find({ product: id, viewer: req.user.id });

  if (view.length < 1) {
    const newView = await productView.create({
      product: id,
      viewer: req.user.id,
    });
  }

  next();
});
