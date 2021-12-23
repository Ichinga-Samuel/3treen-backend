const express = require('express');

const router = express.Router();

const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
const {auth} = require('../middlewares/authenticate')

router.use(auth);

router.route('/').post(auth, orderController.createOrder);

router.route('/').get(orderController.getAllOrders);

router.get('/audit', orderController.getAudit);

router.route('/verifyPayment/:orderID').get(orderController.verifyPayment);

router.route('/myOrders').get(orderController.getUserOrders);

router.route('/vendorOrders').get(orderController.vendorOrders);

router.route('/:id').get(orderController.getSingleOrder);

router.patch('/:id/:status', orderController.updateOrder);

router.route('/status/:status').get(orderController.specificOrders);

module.exports = router;
