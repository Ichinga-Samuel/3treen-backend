const express = require('express');

const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/dashboard', adminController.getDashboard);

//Get all Sales Rep
router.get(
  '/sr_monitor',
  authController.protect,
  authController.accessControl,
  adminController.getAllSalesReps
);

// Get performance of single sales rep
router.get(
  '/sr_monitor/:sr_id',
  authController.protect,
  authController.accessControl,
  adminController.getSalesRepsData
);

module.exports = router;
