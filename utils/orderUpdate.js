const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');

module.exports = (status) =>
  catchAsync(async (req, res, next) => {
    //Get Id from params
    const { id } = req.params;

    //Check if the users match
    const order = await Order.findById(id);

    if (order.user != req.user.id) {
      return next(
        new AppError(`You cannot cancel an order that isn't yours`, 403)
      );
    }

    //Find and Update Order status field to Canceled
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      updatedOrder,
    });
  });
