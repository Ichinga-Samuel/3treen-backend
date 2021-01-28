const express = require('express');

const router = express.Router();

const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

router.route('/').post(authController.protect, orderController.createOrder);

router.route('/').get(orderController.getAllOrders);

router
  .route('/myOrders')
  .get(authController.protect, orderController.getUserOrders);

router
  .route('/:id')
  .get(orderController.getSingleOrder)
  .patch(authController.protect, orderController.cancelOrder);

module.exports = router;
