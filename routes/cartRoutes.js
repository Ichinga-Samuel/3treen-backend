const express = require('express');

const router = express.Router();

const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');
const {auth} = require('../middlewares/authenticate')

router
  .route('/')
  .get(cartController.getAllCartItems)
  .delete(auth, cartController.clearCart);

router
  .route('/:productId')
  .post(auth, cartController.addToCart);

router
  .route('/myCart')
  .get(
    auth, 
    cartController.getUserCart
  );


router
  .route('/:itemId')
  .patch(
    auth,
    cartController.accessControl,
    cartController.updateCartItem
  );

router
  .route('/delete/:id')
  .delete(
    auth,
    cartController.accessControl,
    cartController.clearCart
  );

router
  .route('/:productId')
  .delete(
    auth,
    cartController.removeOneFromCart
  );

module.exports = router;
