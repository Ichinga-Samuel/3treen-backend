const paystack = require('paystack-api')(process.env.PAYSTACK_LIVE_SECRET_KEY);

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const userModel = require("../models/userModel");


function initialize(body){
    paystack.transaction.initialize(body).then((err, body)=>{
        console.log(err, body)
    })
}

exports.charge_card = catchAsync(async (req, res, next) =>{
    const {number,cvv,expiry_month, amount, expiry_year} = req.body
    const card = {number,cvv,expiry_month, expiry_year}
    let body = {email: req.user.email, amount: `${parseFloat(amount)*100}`, card}
    paystack.charge.charge(body).then(function(body){
            // console.log(body)
            if(body.data.status === 'success') res.status(200).json({message: 'Payment Successful', status: 'success'})
            if(body.data.status === 'pending') res.status(200).json({message: 'Payment Pending', status: 'failure'})
            res.status(200).json({message: 'Payment Unsuccessful', status: 'failure'})
        }
    ).catch(err => {
        // console.log(err.error)
        res.status(200).json({message: err.error.data.message, status: 'failure'})
    })
})

exports.bank_account = (req, res, next) =>{

}