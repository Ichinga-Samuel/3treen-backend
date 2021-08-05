const mongoose = require("mongoose");
const paymentStatusSchema = mongoose.Schema({
    //getting the payer
    payer:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'The payer identity is required'],
        ref:"User"
    },
    status:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true
    },
    timeStamp:Date
})

module.exports = mongoose.model('PaymentStatus', paymentStatusSchema);