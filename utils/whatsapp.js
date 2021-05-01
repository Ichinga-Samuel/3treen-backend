const {TWILIO_ACCOUNT_SID,TWILIO_ACOUNT_TOKEN} = process.env
const client = require("twilio")(TWILIO_ACCOUNT_SID,TWILIO_ACOUNT_TOKEN)
//whatsapp classs
class Whatsapp{
    //constructor
    constructor(clientNumber,codde,userName){
        this.clientNumbs = clientNumber
        this.code = codde
        this.userName = userName
        this.sender = process.env.TWILIO_SENDER
    }

    async sendMessage(){
       
        // send messsage
        const response = await client.messages.create({
            body:`Hello ${this.userName}, your password reset code is ${this.code}`, 
            from:this.sender,       
            to:`whatsapp:${this.clientNumbs}` 
        })
      
    }

}

module.exports=Whatsapp;