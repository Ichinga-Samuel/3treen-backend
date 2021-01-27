const express = require('express');

const router = express.Router();

const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

router.route('/').post(authController.protect, orderController.createOrder);

router.route('/').get(orderController.getAllOrders);

router.route('/:id').get(orderController.getSingleOrder);

module.exports = router;
