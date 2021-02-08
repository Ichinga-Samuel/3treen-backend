const express = require('express');

const router = express.Router();

const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/').post(orderController.createOrder);

router.route('/').get(orderController.getAllOrders);

router.route('/myOrders').get(orderController.getUserOrders);

router.route('/:id').get(orderController.getSingleOrder);

router.patch('/:id/:status', orderController.updateOrder);

module.exports = router;
