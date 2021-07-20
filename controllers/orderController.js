const paystack = require('paystack-api')(
  'sk_test_99befe14e54b94b52bb13d65a40bfed88595d74b'
);
const Order = require('../models/orderModel');
const CartItem = require('../models/cartItemModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');
const orderUpdate = require('../utils/orderUpdate');

exports.getAllOrders = factory.getAll(Order);

exports.getSingleOrder = factory.getOne(Order);

exports.createOrder = catchAsync(async (req, res, next) => {
  //Fetch cart items with that user id in their field
  const products = await CartItem.find({ user: req.user, ordered: false });

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

  //Update cart items whose user field matches the current user id
  await CartItem.updateMany(
    { user: req.user, ordered: false },
    { $set: { ordered: true, datePurchased: Date.now(), status: 'Pending' } }
  );

  //Payment
  // 2) Create checkout session
  

  res.status(200).json({
    status: 'success',
    order,
    products,
    
  });
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
  // 1) Find Shipping Order From Database
  const order = await Order.findById(req.params.orderID);

  // 3) Verify if the payment was successful
  const paymentStatus = await paystack.transaction.verify({
    reference: order.paystack.reference,
  });
  if (paymentStatus.data.status === 'success') {
    await order.updateOne({ status: 'Completed' });
  }
  res.status(200).json({
    status: paymentStatus.status,
    message: paymentStatus.message,
    data: {
      data: paymentStatus.data,
    },
  });
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
  const userOrders = await Order.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    userOrders,
  });
});

exports.vendorOrders = catchAsync(async (req, res, next) => {
  const authUserId = String(req.user.id);

  const orders = await CartItem.find({
    ordered: true,
    productUploader: authUserId,
  });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    orders,
  });
});

exports.updateOrder = orderUpdate();

exports.specificOrders = factory.getAll(Order);

exports.getCCheckoutSession;

exports.getAudit = catchAsync(async (req, res, next) => {
  const products = await CartItem.find({ ordered: true });

  res.status(200).json({
    status: 'success',
    results: products.length,
    products,
  });
});
