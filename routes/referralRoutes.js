const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');
const referralController = require('../controllers/referralController');
const salesRepProtect = require('../middlewares/salesRepProtect');

router.use(authController.protect);

router.get('/sales-rep-referrals/:id', referralController.getRefStats);

module.exports = router;
