const express = require('express');

const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const {auth} = require('../middlewares/authenticate')

const router = express.Router();

router.get('/dashboard', adminController.getDashboard);

//Get all Sales Rep
router.get(
  '/sr_monitor',
  authController.accessControl,
  adminController.getAllSalesReps
);

// Get performance of single sales rep
router.get('/sr_monitor/:sr_id', auth, authController.getUser, authController.accessControl, adminController.getSalesRepsData);

router.get(
  '/contacts/:role',
  authController.accessControl,
  adminController.getContacts
);

//Get all products based on a vendor
router.get(
  '/allproducts/:vendor_id',
  auth,
  authController.accessControl,
  adminController.getProductsByVendor
);

//Get the vendor of a product
router.get(
  '/products/:product_id',
  auth,
  adminController.getVendorByProduct
);


module.exports = router;
