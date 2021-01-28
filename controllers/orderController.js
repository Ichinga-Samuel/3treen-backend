const Order = require('../models/orderModel');
const CartItem = require('../models/cartItemModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');

exports.getAllOrders = factory.getAll(Order);

exports.getSingleOrder = factory.getOne(Order);

exports.createOrder = catchAsync(async (req, res, next) => {
  //Fetch cart items with that user id in their field
  const products = await CartItem.find({ user: req.user.id });

  if (products.length < 1)
    return next(new AppError('You have nothing in your cart', 401));

  //distructure fields from request object
  const { state, LGA, phoneNumber } = req.body;

  //finally create order
  const order = await Order.create({
    state,
    LGA,
    phoneNumber,
    name: req.user.fullName,
    user: req.user.id,
    products,
  });

  //Delete cart items whose user field matches the current user id
  await CartItem.deleteMany({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    order,
  });
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
  const userOrders = await Order.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    userOrders,
  });
});
