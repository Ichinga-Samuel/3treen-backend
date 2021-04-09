const multer = require('multer');
const sharp = require('sharp');

const Product = require('../models/productModel');
const factory = require('../controllers/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Category = require('../models/categoryModel');
const productView = require('../models/productViewModel');
const CartItem = require('../models/cartItemModel');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImages = upload.array('images', 5);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(800, 512)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

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

exports.getSingleProduct = factory.getOne(Product,{ path: 'reviews'});

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);

exports.vendorStats = catchAsync(async (req, res, next) => {
  const viewStats = await productView.aggregate([
    {
      $match: { uploaderId: req.user.id },
    },

    {
      $group: {
        _id: '$uploaderId',
        numViews: { $sum: 1 },
      },
    },
  ]);

  const ratingStats = await CartItem.aggregate([
    {
      $match: { productUploader: req.user.id, ordered: true },
    },

    {
      $group: {
        _id: { $month: '$datePurchased' },
        productsSold: { $sum: 1 },
        monthEarnings: { $sum: '$totalPrice' },
      },
    },
  ]);

  const productCount = await CartItem.aggregate([
    {
      $match: { productUploader: req.user.id, ordered: true },
    },
    {
      $group: {
        _id: '$productId',
        numQuantity: { $sum: '$quantity' },
      },
    },

    {
      $sort: { numQuantity: -1 },
    },

    {
      $limit: 3,
    },
  ]);

  const grossEarnings = ratingStats
    .map((el) => el.monthEarnings)
    .reduce((a, b) => a + b);

  res.status(200).json({
    status: 'success',
    viewStats,
    ratingStats,
    grossEarnings,
    productCount,
  });
});
