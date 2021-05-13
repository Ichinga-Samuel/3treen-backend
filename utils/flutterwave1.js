const Flutterwave = require('flutterwave-node-v3');
const axios = require("axios")
 const {FLUTTERWAVE_TEST_ENCKTYPE,FLUTTERWAVE_TEST_PUBLIC_KEY,FLUTTERWAVE_TEST_SECRETE_KEY} = process.env;
 const {FLUTTERWAVE_LIVE_ENCKTYPE,FLUTTERWAVE_LIVE_PUBLIC_KEY,FLUTTERWAVE_LIVE_SECRETE_KEY} = process.env;

 let secretKey = (process.env.NODE_ENV !== "production")?FLUTTERWAVE_TEST_SECRETE_KEY:FLUTTERWAVE_LIVE_SECRETE_KEY
 let publicKey = (process.env.NODE_ENV !== "production")?FLUTTERWAVE_TEST_PUBLIC_KEY:FLUTTERWAVE_LIVE_PUBLIC_KEY

 //innitializing the Flutterwave class
const flw = new Flutterwave(publicKey,secretKey);

class Payment{

    //Card ccharges
   async chargeCard(option){
       try {
           // payload  
           const payload = {
               "card_number":option.card_number,
               "cvv":option.cvv,
               "expiry_month":option.expiry_month,
               "expiry_year":option.expiry_year,
               "currency":option.currency,
               "amount":option.amount,
               "redirect_url": "https://www.google.com",
               "fullname":option.fullname,
               "email":option.email,
               "phone_number":option.phone_number,
               "enckey":(process.env.NODE_ENV !== "production")?FLUTTERWAVE_TEST_ENCKTYPE:FLUTTERWAVE_LIVE_ENCKTYPE,
               "tx_ref": "MC"+Date.now(), // This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
               "authorization": {
                   "mode": "pin",
                   "pin":`${option.pin}`
               } 
           }
           
           //card charge
           const response = await flw.Charge.card(payload)
   
           return response; 

       } catch (error) {
           throw error
       }
    }

    //OTP AUTH
    async otpAuth(cardRespons,otp){
        //this 
        try{
            if (cardRespons.meta.authorization.mode === 'otp') {
                let endpoint2 = cardRespons.meta.authorization.endpoint;
                var url2 = `https://api.flutterwave.com${endpoint2}`
                console.log(url2)
                let encryptData ={
                    "otp":otp,
                    "flw_ref": cardRespons.data.flw_ref,
                    "type": "card"
                    }
                let response2 = await axios.post(url2, encryptData, {
                        headers: {
                            Authorization: `Bearer ${(process.env.NODE_ENV !== "production")?FLUTTERWAVE_TEST_SECRETE_KEY:FLUTTERWAVE_LIVE_SECRETE_KEY}`,
                        }
                });
                // console.log(response2)
                return response2.data;   
                // open(url)
            }

        }catch(error){
            throw error
        }
       
    }

    async payWithUSSD(option1){
        try {
            //payload
            const payload = {
                "tx_ref": "MC-"+Date.now, //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
                "account_bank":option1.account_bank, //This is the Bank numeric code e.g 058
                "amount":option1.amount,
                "currency":option1.currency,
                "email":option1.email,
                "phone_number": option1.phone_number,
                "fullname":option1.fullname
            }
    
            const response = await flw.Charge.ussd(payload)
            return response
            
        } catch (error) {
            throw error
        }
    }

    async payWithBankAccount(option){
        try {
            //payload
            const payload = {
                "tx_ref":`MC-${Date.now()}`, //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
                "amount": option.amount, //This is the amount to be charged.
                "account_bank":option.account_bank, //This is the Bank numeric code. You can get a list of supported banks and their respective codes Here: https://developer.flutterwave.com/v3.0/reference#get-all-banks
                "account_number":option.account_number,
                "currency":option.currency,
                "email":option.email,
                "phone_number":option.phone_number, //This is the phone number linked to the customer's mobile money account
                "fullname": option.fullname
            }
     
            const response = await flw.Charge.ng(payload)
            return response
            
        } catch (error) {
            throw error
        }
    }

    async validateBankAcount(bankAccountResponse,otp){
        try {
            if (bankAccountResponse.meta.authorization.mode === 'otp') {
                let url2 = 'https://api.flutterwave.com/v3/validate-charge'
                // console.log(url2)
                let data = {
                    "otp":otp,
                    "flw_ref":bankAccountResponse.data.flw_ref
                }
                //send request
                let response3 = await axios.post(url2,data, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${(process.env.NODE_ENV !== "production")?FLUTTERWAVE_TEST_SECRETE_KEY:FLUTTERWAVE_LIVE_SECRETE_KEY}`,
                        }
                });
                // console.log(response2)
                return response3.data;   
                // open(url)
            }
            
        } catch (error) {
            throw error
        }
    }
   
}

module.exports = Payment;