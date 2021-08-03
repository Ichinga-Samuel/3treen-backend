const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');
const User = require('../models/userModel');
const Order = require('../models/orderModel');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

//Code to resize image and store as jpg
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

const filterObj = (obj, ...allowedFileds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFileds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//Code to Update fields other than password on the user model
exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user Posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /UpdateMypassword',
        400
      )
    );
  }

  //2) Update user document
  const filteredBody = filterObj(req.body, 'fullName', 'email', 'photo');
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

//Get a particular user
exports.getUser = factory.getOne(User);

//Get me Middleware
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

//GET ALL USERS
exports.getAllUsers = factory.getAll(User);

// this fetch all users without pagination
exports.getAllRawUsers = catchAsync(async (req,res,next)=>{
  const allUsers = await User.find({})
  if(allUsers.length > 0){
    res.status(200).json({
      status:"success",
      length:allUsers.length,
      All_Users:allUsers
    })
  }else{
    res.status(400).json({
      status:"not found or somthing went wrong"
    })
  }
})

exports.updateUserRole = catchAsync(async (req, res, next) => {
  const { userId, role } = req.params;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    updatedUser,
  });
});

//GET USERS BASED ON ROLE
exports.getUsersBasedOnRole = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: req.params.role });

  res.status(200).json({
    results: users.length,
    users,
  });
});

exports.getDashboard = catchAsync(async (req, res, next) => {
  const results = await User.aggregate([
    { $match: {} },
    {
      $group: {
        _id: '$verified',
        total: { $sum: 1 },
      },
    },
  ]);

  const [registered, verified] = results;
  const totalUsers = registered.total + verified.total;

  const users = await User.aggregate([
    { $match: { $or: [{ role: 'CST' }, { role: 'vendor' }] } },
    {
      $group: {
        _id: '$role',
        total: { $sum: 1 },
      },
    },
  ]);

  const secondTotal = users.map((el) => el.total).reduce((a, b) => a + b);

  const orders = await Order.aggregate([
    { $match: { status: 'Completed' } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        revenue: { $sum: '$totalCost' },
      },
    },
  ]);

  let totalRevenue = 0;
  let totalOrders = 0;

  if (orders.length) {
    const { revenue, total: orderTotal } = orders[0];
    totalRevenue = revenue;
    totalOrders = orderTotal;
  }

  res.status(200).json({
    status: 'success',
    registered,
    verified,
    totalUsers,
    users,
    secondTotal,
    totalRevenue,
    totalOrders,
  });
});
