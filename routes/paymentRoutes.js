const express = require('express');

const authController = require('../controllers/authController');
const paymentController = require("../controllers/paymentController")

const router = express.Router();
//card charge
router.post(
    "/card",
    authController.protect,
    paymentController.cardCharge
)

router.post(
    "/card/verify/:otp",
    
    authController.protect,
    paymentController.otpAuth
)

//USSD charge
router.post(
    "/ussd",
    authController.protect,
    paymentController.chargeUssd
)

//bank account
router.post(
    "/bankAccount",
    authController.protect,
    paymentController.chargeBankAccount
)

router.post(
    "/bankAccount/verify:otp",
    authController.protect,
    paymentController.validateBankAcount
)

module.exports = router;