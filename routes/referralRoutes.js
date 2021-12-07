const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');
const referralController = require('../controllers/referralController');
const salesRepProtect = require('../middlewares/salesRepProtect');
const {auth} = require('../middlewares/authenticate')

router.use(auth);

router.get('/sales-rep-referrals/:id', referralController.getRefStats);

module.exports = router;
