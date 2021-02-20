const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const signToken = require('../utils/signToken');
const sendEmail = require('../utils/email');
const User = require('../models/userModel');
const crypto = require('crypto');
const Referral = require('../models/referralModel');

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  //Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

//Code for user signup
exports.signup = catchAsync(async (req, res, next) => {
  const userData = { ...req.body };

  const { fullName, email, password, passwordConfirm } = userData;
  const newUser = await User.create({
    fullName,
    email,
    password,
    passwordConfirm,
  });

  if (req.user) {
    await Referral.create({
      salesRep: req.user.id,
      user: newUser,
    });
  }

  createSendToken(newUser, 201, res);
});

//Code for user login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(email, password);

  //1) check if email or password was passed in
  if (!email || !password) {
    return next(new AppError('Please Provide email and password!', 400));
  }

  //2) Check if  user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('No User with that email', 404));
  }

  //Check if inputed password is correct

  const correct = await user.correctPassword(password, user.password);

  if (!correct) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3) If everything is ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // //1) Getting token and check if its there
  
  let token;
  if (
    req.headers.authorization  && req.headers.authorization.startsWith('Bearer')
  ) {
    // console.log(req.headers.authorization)
    token = req.headers.authorization.slice(6)
    // token = req.headers.authorization.split(' ')[1];
  }

  //2) Validate token
  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to the token no longer exists.', 401)
    );
  }

  //4) Check if user changed password after jwt was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login  again', 401)
    );
  }

  // GRANT ACCESS TO ROUTE
  req.user = currentUser;

  next();
});

//Access Control
exports.accessControl = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Only Admins can do this', 403));
  }
  console.log('access control');

  next();
});

//Code to reset User password
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  console.log(hashedToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) If token  has not expired, and there is user, set new password
  if (!user) {
    return next(new AppError('Token is invalid or has  expired', 400));
  }

  //3) Update changedPasswordAt property for the user
  const { password, passwordConfirm } = req.body;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  //4) Log the user in, send JWT to the client
  createSendToken(user, 200, res);
});

//Code for forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on posted email
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('There is no user with that email', 404));
  }

  //2) Generate the random restet token
  const resetToken = user.createPassswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) Send it back as an email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget, please ignore this email!`;

  //Actually send email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Valid only for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.createPassswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //2) Check if posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  //3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //4) Log user in, send JWT
  createSendToken(user, 200, res);
});
