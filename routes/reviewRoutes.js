const express = require("express");
const routerr = express.Router();

const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");
const {auth} = require('../middlewares/authenticate')
//review route
routerr
    .route('/')
    .get(reviewController.getAllReviews)
    
    
    
routerr
    .route('/:id')
    .post(auth, reviewController.makeReview)
    .patch(
        auth,
        reviewController.updateReview
    )
    .delete(auth,reviewController.removeReview)

module.exports = routerr;
    