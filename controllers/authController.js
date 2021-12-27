const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const signToken = require('../utils/signToken');
const User = require('../models/userModel');
const crypto = require('crypto');
const Referral = require('../models/referralModel');
const Whatsapp = require('../utils/whatsapp');
const {encode, decode} = require('../utils/encrypt');
const {emailService} = require('../utils/messanger');

const onlyAdminPermitted = (role) => {
  if (role == 'QA' || role == 'SR' || role == 'CST'){
    return false
  }
  return true
}

const createSendToken = (user, statusCode, res) => {
  const token = user.genJwt();
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body)
  const userData = { ...req.body };

  let { fullName, email, password, address, state, homePhone, workPhone } = userData;

  const userExists = await User.exists({ email });

  if (userExists) {
    return res.status(400).json({
      message: 'User already exists',
    });
  }
  const user = new User()
  user.setPassword(password)
  user.set({fullName, email, address, state, homePhone, workPhone})
  await user.save()
  if (user) {
    await Referral.create({salesRep: user.id, user: user});
    let token = await encode({id: user._id, from: req.get('origin')})
    let path = req.originalUrl.replace(req.path, '')
    let body = {data: {link: `${req.protocol}://${req.headers.host}${path}/activate/${token}`, name: req.body.name,
        title: 'Account Activation'}, subject: 'Account Verification', type: 'activation', recipient: req.body.email}
    let mail = new emailService()
    try{
        let resp = await mail.activate(body)
    }
    catch(e){
        res.status(201).json({message: 'Account Creation Was Successful. We were unable to send a verification message to your email', status: 'success'})
    }
    res.status(201).json({message: 'Account Creation Was Successful Check your Email to Activate your Account', status: "success"})
  }
});

exports.getUser = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id);
  if (!currentUser) return next(new AppError('The user belonging to the token no longer exists.', 401))
  req.user = currentUser;
  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password){
    return next(new AppError('Please Provide email and password!', 400));
  }

  let user = await User.findOne({ email }).select('+password');

  if(user.isValidPassword(password)) {
    user.lastLoginTime = new Date();
    user.lastLogoutTime = null;
    await user.save()
    let token = user.genJwt();
    createSendToken(user, 200, res)
  }else{return next(new AppError('Incorrect email or password', 401));}

});

exports.logout = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.user.id)
 
  user.lastLogoutTime = new Date();
  await user.save()
  res.send('Logout Succesfull');
});

exports.verify = catchAsync(async (req, res) =>{
  let user = await User.findById(req.user.id)
  let token = await encode({id: user._id, from: req.get('origin')})
  let path = req.originalUrl.replace(req.path, '')
  let body = {data: {link: `${req.protocol}://${req.headers.host}${path}/activate/${token}`, name: req.body.name,
      title: 'Account Activation'}, subject: 'Account Verification', type: 'activation', recipient: req.body.email}
  let mail = new emailService()
  try{
    let resp = await mail.activate(body)
  }
  catch(e){
    res.status(201).json({message: 'Unable to send verification email. Make sure your email address is correct', status: true})
  }
  res.status(200).json({message: "Verification Email has been sent to your mail", status: "success"})
})

exports.activate = catchAsync(async (req, res)=>{
  let token = req.params['token'];
  let data = await decode(token)
  await User.findByIdAndUpdate(data.id, {verified: true})
  res.redirect(data.from)
})

exports.accessControl = catchAsync(async (req, res, next) => {
  // Get User
  const user = await User.findById({ _id: req.user.id });
  
  if (user.role === 'admin' || user.role === 'sub-admin') {
    return next();
  }
  return next(new AppError('Only Admins can do this', 403));
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('There is no user with that email', 404));
  }
  if (user.role == 'sub-admin'){
    return next(new AppError('Please request a new password from Super admin', 403));
  }
  try{
    let token = await encode({email: user.email}, {expiresIn: "24h"})
    let body = {data: {link: `${req.get('origin')}/resetPassword/${token}`, name: user.name, title: 'Password Reset'},
      recipient: user.email, subject: "Password Reset", type: 'pwd_reset'}

    let mailer = new emailService()
    let resp = await mailer.reset(body)
    res.status(200).json({
      status: 'success',
      message:
        'A password reset code has been sent to your Email',
    });
  }
  catch (error) {
    return next( new AppError('There was an error sending the email. Try again later!', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  let data = await decode(req.body.token);
  let user = await User.findOne({email: data.email}, 'email');
  let pwd = req.body.password;
  user.setPassword(pwd)
  user.passwordChangedAt = new Date()
  await user.save()
  res.status(200).json({msg: "Password Reset Successful", status: true})
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  if (req.user.role == 'sub-admin') {
    return next(new AppError('Only a Super admin can do this', 403));
  }
  const user = await User.findById(req.user.id).select('+password');
  if(!user.isValidPassword(req.body.passwordCurrent)) return next(new AppError('Your current password is wrong', 401));

  user.setPassword(req.body.password)
  await user.save();
  createSendToken(user, 200, res);
});

exports.setCompany = catchAsync(async (req, res, next) => {
  req.role = 'company';

  next();
});

exports.inviteAdmin = catchAsync(async (req, res, next) => {
  // simply upgrade an existing user to admin no need to create a user in this route.
  let admin = await User.findById(req.user.id).select('role')
  if(admin.role !== 'admin') return new AppError('You need to be Admin to do this')
  let id = req.params.id
  await User.findByIdAndUpdate(id, {role: admin})
  res.status(200).json({message: "Action successful", status: "success"})
})
