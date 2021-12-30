const express = require('express');
const authController = require('../controllers/authController');
const paymentController = require("../controllers/paymentController")
const paystackController = require("../controllers/paystackController")
const {auth} = require("../middlewares/authenticate");


const router = express.Router();
//card charge
router.post(
    "/card",
    auth,
    authController.getUser,
    paystackController.charge_card
)

router.post(
    "/card/verify/:otp",
    auth,
    paymentController.otpAuth
)
router.post('/paystack_hook', (req, res)=>{
    console.log(req.body, 'hugf')
})
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