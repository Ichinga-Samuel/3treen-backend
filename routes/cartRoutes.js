const express = require('express');

const router = express.Router();

const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

router.route('/').get(cartController.getAllCartItems);

router
  .route('/:productId')
  .post(authController.protect, cartController.addToCart);

router.route('/myCart').get(authController.protect, cartController.getUserCart);

router
  .route('/:itemId')
  .patch(
    authController.protect,
    cartController.accessControl,
    cartController.updateCartItem
  );

router
  .route('/:id')
  .delete(
    authController.protect,
    cartController.accessControl,
    cartController.removeFromCart
  );

module.exports = router;
