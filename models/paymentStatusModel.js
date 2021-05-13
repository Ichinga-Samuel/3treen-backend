const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
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