const express = require('express');

const authController = require('../controllers/authController');
const paymentController = require("../controllers/paymentController")
const {auth} = require("../middlewares/authenticate");

const router = express.Router();
//card charge
router.post(
    "/card",
    auth,
    paymentController.cardCharge
)

router.post(
    "/card/verify/:otp",
    
    auth,
    paymentController.otpAuth
)

//USSD charge
router.post(
    "/ussd",
    auth,
    paymentController.chargeUssd
)

//bank account
router.post(
    "/bankAccount",
    auth,
    paymentController.chargeBankAccount
)

//validate bank
router.post(
    "/bankAccount/verify/:otp",
    auth,
    paymentController.validateBankAcount
)

module.exports = router;