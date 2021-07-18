const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const signToken = require('../utils/signToken');
const Email = require('../utils/email');
const User = require('../models/userModel');
const crypto = require('crypto');
const Referral = require('../models/referralModel');
const Whatsapp = require('../utils/whatsapp');

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

  let role;
  if (req.role) {
    role = req.role;
  } else {
    role = 'user';
  }

  // check if user with the same email allready exit
  const userExists = await User.exists({ email });

  if (userExists) {
    return res.status(400).json({
      message: 'User already exists',
    });
  }

  const newUser = await User.create({
    fullName,
    email,
    password,
    passwordConfirm,
    role,
  });

  if (req.user) {
    await Referral.create({
      salesRep: req.user.id,
      user: newUser,
    });
  }

  // const url = `${req.protocol}://${req.get('host')}/me`;
  // await new Email(newUser).sendWelcome();

  createSendToken(newUser, 201, res);
});

//Code for user login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

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
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // console.log(req.headers.authorization)
    //token = req.headers.authorization.slice(6)
    token = req.headers.authorization.split(' ')[1];
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
console.log('protrect');
  next();
});

//Access Control
exports.accessControl = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin' || req.user.role !== 'sub-admin') {
    return next(new AppError('Only Admins can do this', 403));
  }

  next();
});

//Code to reset User password
// exports.resetPassword = catchAsync(async (req, res, next) => {
//   //1) Get user based on the token
//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(req.params.token)
//     .digest('hex');

//   const user = await User.findOne({
//     passwordResetCode: req.params.code,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   //2) If token  has not expired, and there is user, set new password
//   if (!user) {
//     return next(new AppError('Reset code is invalid or has  expired', 400));
//   }

//   res.status(200).json({
//     status: 'success',
//     message: 'Reset code is valid',
//   });
// });

//Code for forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  if (req.user.role == 'sub-admin') {
    return next(new AppError('Please request a new password from Super admin', 403));
  }
  //1) Get user based on posted email
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('There is no user with that email', 404));
  }
  // const resetToken = user.createPasswordResetToken();
  // await user.save({ validateBeforeSave: false });

  //3) Send it back as an email

  try {
    //2) Generate the random restet CODE
    const resetCode = Math.floor(1000 + Math.random() * 9000);

    // const resetURL = `${req.protocol}://${req.get(
    //   'host'
    // )}/api/v1/users/resetPassword/${resetToken}`;

    //send reset code through email
    await new Email(user, resetCode).sendPasswordReset();

    //send reset code through whatsapp
    if (user.homePhone || user.workPhone) {
      await new Whatsapp(
        user.homePhone || user.workPhone,
        resetCode
      ).sendMessage();
    }

    user.passwordResetCode = resetCode;
    user.passwordRE = Date.now() + 60 * 10000;
    user.passwordResetExpires = Date.now() + 60 * 10000;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message:
        'Code has been sent to your Email and WhatsApp\n check your inbox',
    });
  } catch (error) {
    if (error) {
      user.createPassswordResetCode = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          'There was an error sending the email. Try again later!',
          500
        )
      );
    }
  }
});

//confirm password reset code
exports.confirmResetCode = catchAsync(async (req, res, next) => {
  //check if the code exist
  const user = await User.findOne({
    passwordResetCode: req.params.code,
    passwordRE: { $gt: Date.now() },
  });

  //2) If token  has not expired, and there is user, set new password
  if (!user) {
    return next(new AppError('Reset code is invalid or has expired', 400));
  }

  // GIVE PREMISION
  res.status(200).json({
    status: 'success',
    message: 'Reset code is valid',
    passwordResetCode: req.params.code,
  });
});

//Code to reset User password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Update changedPasswordAt property for the user
  if (req.user.role == 'sub-admin') {
    return next(new AppError('Only a Super admin can do this', 403));
  }
  const { code } = req.params;
  const { password, passwordConfirm } = req.body;
  const mainUser = await User.findOne({ passwordResetCode: code });
  if (mainUser) {
    if (passwordConfirm && password) {
      mainUser.password = password;
      mainUser.passwordConfirm = passwordConfirm;
      mainUser.passwordResetExpires = undefined;
      mainUser.passwordResetCode = undefined;
      mainUser.passwordRE = undefined;
      await mainUser.save();

      // Log the user in, send JWT to the client
      createSendToken(mainUser, 200, res);
    } else {
      return next(
        new AppError(
          "password and passwordConfirm can't be empty, pleass set your password",
          400
        )
      );
    }
  } else {
    return next(
      new AppError(
        'Error #U404R: sorry something went wrong, if this contenue pls contact the customer care',
        400
      )
    );
  }
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  if (req.user.role == 'sub-admin') {
    return next(new AppError('Only a Super admin can do this', 403));
  }
  //1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  console.log(user);
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

exports.setCompany = catchAsync(async (req, res, next) => {
  req.role = 'company';

  next();
});

exports.inviteAdmin = catchAsync(async (req, res, next) => {
  const userData = { ...req.body };
  const { fullName, email, password, passwordConfirm } = userData;
  const role = 'sub-admin'
  const adminExists = await User.exists({ email, role });

  if (adminExists) {
    return res.status(400).json({
      message: 'Admin already exists',
    });
  }

  const newAdmin = await User.create({
    fullName,
    email,
    password,
    passwordConfirm,
    role,
  });
  await new Email(newAdmin).sendWelcome();
  createSendToken(newAdmin, 201, res);
})
