const express = require("express");
const routerr = express.Router();

const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");
//review route
routerr
    .route('/')
    .get(reviewController.getAllReviews)
    
    
    
routerr
    .route('/:id')
    .post(authController.protect, reviewController.makeReview)
    .patch(
        authController.protect,
        reviewController.updateReview
    )
    .delete(authController.protect,reviewController.removeReview)

module.exports = routerr;
    