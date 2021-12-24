const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Referral = require('../models/referralModel');
const rewiewdModel = require('../models/reviewModel');


// Get all exising Sales Rep
exports.getAllSalesReps = catchAsync(async (req, res, next) => {
  try {
    const allSalesRep = await User.find({role: "SR"});
    res.status(200).json({
      status:"success",
      length: allSalesRep.length,
      data: allSalesRep
    })
  } catch (error) {
    new AppError(error, 500)
  }

});

// Get a Sales Rep Data
exports.getSalesRepsData = catchAsync(async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user');
    let salesRepOrders = [];
    let referral;
    salesRepOrders = orders.filter( async (order)=>{
      referral = await Referral.find({salesRep: req.params.sr_id, user: order.user._id})
      if(referral){
        return order;
      }
    })
    res.status(200).json({
      status: "success",
      orders: salesRepOrders
    })
  } catch (error) {
    new AppError(error, 500)
  }
});

exports.getDashboard = catchAsync(async (req, res, next) => {
  const results = await User.aggregate([
    { $match: {} },
    {
      $group: {
        _id: '$verified',
        total: { $sum: 1 },
      },
    },
  ]);

  const [registered, verified] = results;
  const totalUsers = registered.total + verified.total;

  const users = await User.aggregate([
    { $match: { $or: [{ role: 'CST' }, { role: 'vendor' }] } },
    {
      $group: {
        _id: '$role',
        total: { $sum: 1 },
      },
    },
  ]);

  const secondTotal = users.map((el) => el.total).reduce((a, b) => a + b);

  const orders = await Order.aggregate([
    { $match: { status: 'Completed' } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        revenue: { $sum: '$totalCost' },
      },
    },
  ]);

  let totalRevenue = 0;
  let totalOrders = 0;

  if (orders.length) {
    const { revenue, total: orderTotal } = orders[0];
    totalRevenue = revenue;
    totalOrders = orderTotal;
  }

  res.status(200).json({
    status: 'success',
    registered,
    verified,
    totalUsers,
    users,
    secondTotal,
    totalRevenue,
    totalOrders,
  });
});

// Get contacts info of users
exports.getContacts = catchAsync(async (req, res, next) => {
  try {
    const { role } = req.params;
    let contacts = await User.find({role})
      .select(['fullName', 'email', 'photo', 'address', 'state', 'homePhone', 'workPhone'])

    res.status(200).json({
      status: "success",
      contacts: contacts
    })
  } catch (error) {
    new AppError(error, 500)
  }
});


// Get all products based on a vendor
exports.getProductsByVendor = catchAsync(async (req, res, next) => {
  // get user
  const user = await User.findById({ _id:req.params.vendor_id });
  if (!user) return res.status(404).json(
    { status : "Failed",
      message: "User Not Found Or Does Not Exist" });
  if (user.role !== "vendor") return res.status(400).json(
    { status : "Failed",
      message: "User Is Not A Vendor" });

  try {
    const products = user.products;
    if (products.length < 1) return res.status(299).json(
      { status: "Success",
        message: "Vendor Has No Products Yet"});

    else return res.status(200).json(
      { status: "Success",
       products })
  } catch (error) {
    new AppError(error, 500);
  }

})
