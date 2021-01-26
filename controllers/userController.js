const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');
const User = require('../models/userModel');

const filterObj = (obj, ...allowedFileds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFileds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//Code to Update fields other than password on the user model
exports.user_update = catchAsync(async (req, res, next) => {
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
  const filteredBody = filterObj(req.body, 'fullName', 'email');
  if (req.file) filteredBody.avatar = req.file.filename;

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
