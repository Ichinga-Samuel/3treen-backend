const upload = require('../utils/multer');

const Product = require('../models/productModel');
const factory = require('../controllers/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Category = require('../models/categoryModel');
const productView = require('../models/productViewModel');
const CartItem = require('../models/cartItemModel');
const cloudinary = require('../utils/cloudinary');

const User = require('../models/userModel');

exports.uploadProductImages = upload.array('images', 5);

exports.createProduct = catchAsync(async (req, res, next) => {
  //Get category from request body
  const { category } = req.body;

  console.log(category)

  //Check if category exists in DB
  const categoryCheck = await Category.find({ name: category });

  //If it doesn't exist throw error
  if (categoryCheck.length < 1) {
    return next(new AppError('Category not found', 404));
  }
  const { files } = req;

 

  const images = [];
  let imageUrls;

  try {
    for (file of files) {
      const { path } = file;
      const newPath = await cloudinary.uploader.upload(path);
      images.push(newPath);
    }
    imageUrls = images.map((el) => el.secure_url);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error,
    });
  }
  // Add Images array to request body
  req.body.images = imageUrls;

  req.body.uploader = req.user.id;

  const product = await Product.create(req.body);

  // Get User Uploading Product
  const user = await User.findById({ _id : req.user.id });
  // Update user's products
  user.products.push(product);
  const updatedUser = await User.findOneAndUpdate(
      { _id:user._id },
      { $set:user })

  res.status(201).json({
    status: 'success',
    product,
  });
});

exports.getAllProducts = factory.getAll(Product);

exports.getSingleProduct = factory.getOne(Product, { path: 'reviews' });

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

  let grossEarnings;

  if (!ratingStats.length) {
    grossEarnings = [];
  } else {
    grossEarnings = ratingStats
      .map((el) => el.monthEarnings)
      .reduce((a, b) => a + b);
  }

  res.status(200).json({
    status: 'success',
    viewStats,
    ratingStats,
    grossEarnings,
    productCount,
  });
});

exports.vedorProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ uploader: req.user.id });

  res.status(200).json({
    status: 'success',
    results: products.length,
    products,
  });
});

// Get vendor based on product
exports.getVendorByProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById({ _id:req.params.product_id });

  if (!product) {
    return res.status(404).json({ 
      status: "failure",
      message: "Product Not Found Or Does Not Exist"
    });
  }

  const vendor = await User.findById({ _id:product.uploader });

  return res.status(200).json({ 
    status: "success",
    vendor : {
      fullName : vendor.fullName,
      photo : vendor.photo,
      verified : vendor.verified,
      phone : vendor.workPhone,
      rating: vendor.rating
    }
  })

})


// Get all products based on a vendor
exports.getProductsByVendor = catchAsync(async (req, res, next) => {
  // get user
  const user = await User.findById({ _id:req.params.vendor_id });

  if (!user) {
    return res.status(404).json({ 
      status : "Failed",
      message: "User Not Found Or Does Not Exist" 
    });
  }

  if (user.role !== "vendor") {
     return res.status(400).json({ 
      status : "Failed",
      message: "User Is Not A Vendor" 
    });
  }

  try {
    const products = user.products;
    if (products.length < 1) {
      return res.status(299).json({ 
        status: "Success",
        message: "Vendor Has No Products Yet"
      });
    } else {
      return res.status(200).json({ 
        status: "Success",
        products 
      })
    }
  } catch (error) {
    new AppError(error, 500);
  }

})


// exports.topSellingProducts = catchAsync(async (req, res, next) => {
//   const products = await CartItem.aggregate([
//     {
//       $match: { ordered: true },

//       $group: {
//         _id: '$productIdString',
//         numViews: { $sum: 1 },
//       },
//     },
//   ])
// })
