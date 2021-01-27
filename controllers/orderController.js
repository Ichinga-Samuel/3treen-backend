const Order = require('../models/orderModel');
const CartItem = require('../models/cartItemModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');

exports.getAllOrders = factory.getAll(Order);

exports.getSingleOrder = factory.getOne(Order);

exports.createOrder = catchAsync(async (req, res, next) => {
  //Fetch cart items with that user id in their field
  const cart = await CartItem.find({ user: req.user.id });

  if (cart.length < 1)
    return next(new AppError('You have nothing in your cart', 401));

  //distructure fields from request object
  const { state, LGA, phoneNumber } = req.body;

  //Get total number of products ordered
  const quantity = cart.map((el) => el.quantity).reduce((a, b) => a + b);

  //Get total price of each item for the quantity specified
  const prices = cart.map((el) => el.quantity * el.product.price);

  //Get total price of the entire cart
  const totalCost = prices.reduce((a, b) => a + b);

  //finally create order
  const order = await Order.create({
    quantity,
    totalCost,
    state,
    LGA,
    phoneNumber,
    name: req.user.fullName,
    cart,
  });

  res.status(200).json({
    status: 'success',
    order,
  });
});
