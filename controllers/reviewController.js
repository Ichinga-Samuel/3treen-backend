const reviewModel = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');
const userModel = require('../models/userModel');
const poductModel = require('../models/productModel');
const productModel = require('../models/productModel');

module.exports = {
  //make review
  makeReview: catchAsync(async (req, res, next) => {
    //getting reviewInfo from reqest body
    const { ratting, message } = req.body;

    //get current logedIn user
    var { id } = req.user;

    // authenticate user for making only one review for a particular product
    var checkUser = await productModel
      .find({ _id: req.params.id })
      .populate({ path: 'reviews', populate: 'reviewer' });
    var checkUserResult = checkUser[0].reviews.find(function (reviews33) {
      return reviews33.reviewer._id == id;
    });

    if (checkUserResult.reviewer._id != id) {
      //create review info
      const reviewInfo = await reviewModel.create({
        reviewer: await userModel.findById(id),
        message: message,
        rattingNumber: ratting,
        dateOfReview: new Date().toUTCString(),
        reviewdProduct: await poductModel.findOne({ _id: req.params.id }),
      });
      //success response to the client
      res.status(200).json({
        status: 'success',
        reviewInfo,
      });
    } else {
      return next(
        new AppError('hello, you cannot make two reviews on one product', 402)
      );
    }
  }),

  //get all reviews
  getAllReviews: catchAsync(async (req, res, next) => {
    var allReview = await reviewModel.find();
    res.status(200).json({
      status: 'success',
      allReview,
    });
  }),
  //edit review
  updateReview: factory.updateOne(reviewModel),

  //delete review
  removeReview: factory.deleteOne(reviewModel),
};
