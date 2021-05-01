const Payment = require("../utils/flutterwave1")
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const userModel = require("../models/userModel");
const bankList = require("../utils/bankListAndCode");

let bankNumberForUssd = async (bank)=>{
    let bank2 = bankList.ussdBank();
    let bankDetails = await bank2.find((el)=> el.name == bank)
    if(bankDetails != undefined){
        return bankDetails
    }
    else{
        throw new Error("Bank not found")
    }
}

let generalBankCode = async (bank)=>{
    let bank1 = bankList.generalBankList();
    let bankDetails = await bank1.find((el)=> el.name == bank)
    if(bankDetails != undefined){
        return bankDetails
    }
    else{
        throw new Error("Bank not found")
    }
}
//payment response
let paymentResponse;
let paymentResponse2;

exports.cardCharge = catchAsync(async (req,res,next)=>{
    try {
        //get req
        const {pin,card_number,cvv,expiry_month,currency,amount,expiry_year} = req.body
        //get the current user
        const currentUser = await userModel.findOne({email:req.user.email});
        if(currentUser.homePhone || currentUser.workPhone){
            //aggument be sent as a payload
            let options ={
                pin,
                card_number,
                cvv,
                expiry_month,
                currency,
                amount,
                expiry_year,
                fullname:currentUser.fullName,
                email:currentUser.email,
                phone_number:(currentUser.homePhone || currentUser.workPhone)
            }
        
            // console.log(options)
        
            //initiating the Payment class
            let fluterPayment = new Payment();
        
            //charging the user with card
            let response1 = await fluterPayment.chargeCard(options);
            //confirm the response
            // console.log(response1)
            if(response1){
                if (response1.meta.authorization.mode === 'redirect') {
                    var url = response1.meta.authorization.redirect
                    res.status(200).json({
                        status: 'success',
                        redirect:url
                    }); 
                }
        
                paymentResponse = response1;
        
                res.status(200).json({
                    status: 'success',
                    response:response1.data.processor_response
                });
            }

        }else{
            next(new AppError("Plese set up your profile to make payment..",400))
        }
        
    } catch (error) {
        next(new AppError("CARD payment issue 1, pls contact your customer care",400))     
    }

   
})

//OTP Auth

exports.otpAuth = catchAsync(async (req,res,next)=>{
    try {
        //get req.param
        const {otp} = req.params;

        //get the current user
        const currentUser = await userModel.findOne({email:req.user.email});

        //initiating the Payment class
        let fluterPayment = new Payment();

        //input otp for final auth
        let finalRespones = await fluterPayment.otpAuth(paymentResponse,otp);

        //send finalrespones to the client
        res.status(200).json({
            status: 'success',
            response:`${finalRespones.data.narration} is ${finalRespones.data.processor_response}`
        });       
       
    } catch (error) {
        next(new AppError("CARD payment issue 2, pls contact your customer care",400))
    }
})

//payment trought USSD
exports.chargeUssd = catchAsync(async (req,res,next)=>{
    try {
         //get req
         const {currency,amount,bankName} = req.body

         let bankCode = await bankNumberForUssd(bankName)
        //  console.log(bankCode)
         //get the current user
         const currentUser = await userModel.findOne({email:req.user.email});
        if(currentUser.homePhone || currentUser.workPhone){
            //aggument be sent as a payload
            let options ={
               account_bank:bankCode.code,
               currency,
               amount,
               fullname:currentUser.fullName,
               email:currentUser.email,
               phone_number:(currentUser.homePhone || currentUser.workPhone)
            }
    
            //initiating the Payment class
            let fluterPayment = new Payment();
   
            //cllinng the payWithUSSD method
            let mainResponse = await fluterPayment.payWithUSSD(options)
           //  console.log(mainResponse)
            //statuse cheack
            if(mainResponse.data.status == "pending"){
                if(mainResponse.meta.authorization.mode == "ussd"){
                    res.status(200).json({
                        status: 'success',
                        USSD_CODE:mainResponse.meta.authorization.note
                    }); 
                }
            }

        }else{
            next(new AppError("Plese set up your profile to make payment..",400))
        }

    } catch (error) {
        next(new AppError("USSD payment issue, pls contact your customer care",400))
    }

})

//payment with bank account
exports.chargeBankAccount = catchAsync(async (req,res,next)=>{
    try {
        //gettinng the request
        const {account_number,currency,amount,bank_name} = req.body;
        //make search for the bank number
        let bankCode = await generalBankCode(bank_name);
        // console.log(bankCode)
        //checking for current user
        const currentUser = await userModel.findOne({email:req.user.email});

        //paylod options
        if(currentUser.homePhone || currentUser.workPhone){
            let options ={
                account_number,
                account_bank:bankCode.code,
                currency,
                amount,
                fullname:currentUser.fullName,
                email:currentUser.email,
                phone_number:(currentUser.homePhone || currentUser.workPhone)
            }
            //initiating the fluterwave class
            let fluterPayment = new Payment();
    
            //calling the payWithBankAccount method
            let response = await fluterPayment.payWithBankAccount(options);
          //  console.log(response)
             //status cheack
            if(response.data.status == "pending"){
                paymentResponse2 =  response;
                if(response.meta.authorization.mode == "otp"){
                    res.status(200).json({
                        status: 'success',
                        validate_instructions:response.meta.authorization.validate_instructions
                    }); 
                }
            }
    
            res.status(200).json({
                status: 'success',
                response:`${response.data.processor_response}`
            });

        }else{
            next(new AppError("Plese set up your profile to make payment..",400));
        }
        //  //status cheack
        // if(response.data.status == "successful"){
        // }


    } catch (error) {
        // console.log(error)
        next(new AppError("BankAccount payment issue, pls contact your customer care",400))
    }
})

//validation of Bank account payment
exports.validateBankAcount = catchAsync(async (req,res,next)=>{
    try {

        //get req.param
        let {otp} = req.params;

        //get the current user
        let currentUser = await userModel.findOne({email:req.user.email});

        //initiating the Payment class
        let fluterPayment = new Payment();

        //input otp for final auth
        let finalRespones = await fluterPayment.validateBankAcount(paymentResponse2,otp);
    
        //send finalrespones to the client
        res.status(200).json({
            status: 'success',
            response:`${finalRespones.data.narration} is ${finalRespones.data.processor_response}`
        });  
        

    } catch (error) {
        next(new AppError("Bank account payment issue 2, pls contact your customer care",400))  
    }
})
