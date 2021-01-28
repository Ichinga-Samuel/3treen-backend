const Product = require('../models/productModel');
const factory = require('../controllers/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Category = require('../models/categoryModel');

exports.createProduct = catchAsync(async (req, res, next) => {
  //Get category from request body
  const { category } = req.body;

  //Check if category exists in DB
  const categoryCheck = await Category.find({ name: category });

  //If it doesn't exist throw error
  if (categoryCheck.length < 1)
    return next(new AppError('DB does not contain category specified', 404));

  const product = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    product,
  });
});

exports.getAllProducts = factory.getAll(Product);

exports.getSingleProduct = factory.getOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
