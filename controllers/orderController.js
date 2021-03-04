const flutterwave = require('../utils/flutterwave');

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

  //Update cart items whose user field matches the current user id
  await CartItem.updateMany(
    { ordered: false },
    { $set: { ordered: true, datePurchased: Date.now() } }
  );

  //Payment
  // Initialize the flutterwave class
  const Ravepay = require('flutterwave-node');

  const rave = new Ravepay(
    process.env.PUBLICK_KEY,
    process.env.SECRET_KEY,
    true
  );

  rave.Card.charge({
    cardno: req.body.cardno,
    cvv: req.body.cvv,
    expirymonth: req.body.expirymonth,
    expiryyear: req.body.expiryyear,
    currency: 'NGN',
    country: 'NG',
    amount: order.totalCost,
    email: req.user.email,
    phonenumber: req.user.phoneNumber,
    firstname: 'Ceder',
    lastname: 'Daniel',
    IP: '355426087298442',
    txRef: 'MC-' + Date.now(), // your unique merchant reference
    meta: [{ metaname: 'flightID', metavalue: '123949494DC' }],
    redirect_url: 'https://rave-webhook.herokuapp.com/receivepayment',
    device_fingerprint: '69e6b7f0b72037aa8428b70fbe03986c',
  })
    .then((resp) => {
      console.log(resp.body);

      rave.Card.validate({
        transaction_reference: resp.body.data.flwRef,
        otp: 12345,
      }).then((response) => {
        console.log(response.body.data.tx);
      });
    })
    .catch((err) => {
      console.log(err);
    });

  res.status(200).json({
    status: 'success',
    order,
    products,
  });
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
  const userOrders = await Order.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    userOrders,
  });
});

exports.updateOrder = orderUpdate();

exports.specificOrders = factory.getAll(Order);

exports.getCCheckoutSession;
