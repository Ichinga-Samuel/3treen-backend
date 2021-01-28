const CartItem = require('../models/cartItemModel');

//Utility functions
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');
const filterObj = require('../utils/filterObj');
const AppError = require('../utils/appError');

exports.accessControl = catchAsync(async (req, res, next) => {
  //Get cart item Id from params
  const { id } = req.params;

  const cartItem = await CartItem.findById(id);

  if (req.user.id != cartItem.user) {
    return next(new AppError('You are now allowed to do this', 403));
  }

  next();
});

exports.addToCart = catchAsync(async (req, res, next) => {
  //Get Product Id from params
  const { productId } = req.params;

  //Create Cart Item
  const cartItem = await CartItem.create({
    user: req.user.id,
    productId,
    quantity: req.body.quantity,
  });

  res.status(200).json({
    status: 'success',
    cartItem,
  });
});

exports.getAllCartItems = factory.getAll(CartItem);

exports.getUserCart = catchAsync(async (req, res, next) => {
  //Fetch cart items with that user id in their field
  const cart = await CartItem.find({ user: req.user.id });

  let total;
  let prices;

  if (cart.length > 1) {
    //Get total price of each item for the quantity specified
    prices = cart.map((el) => el.quantity * el.product.price);

    //Get total price of the entire cart
    total = prices.reduce((a, b) => a + b);
  }

  res.status(201).json({
    status: 'success',
    results: cart.length,
    total,
    cart,
  });
});

exports.updateCartItem = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'quantity');
  //Get cart item Id from params
  const { itemId } = req.params;

  const updatedItem = await CartItem.findByIdAndUpdate(itemId, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    updatedItem,
  });
});

exports.removeFromCart = factory.deleteOne(CartItem);

exports.clearCart = catchAsync(async (req, res, next) => {
  //Delete cart items whose user field matches the current user id
  await CartItem.deleteMany({ user: req.user.id });

  res.status(204).json({
    status: 'success',
  });
});
