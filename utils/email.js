const nodemailer = require('nodemailer');
// const htmlToText = require('html-to-text');
// const pug = require('pug');
const fs = require("fs");

const { DEV_MAIL_USER, DEV_MAIL_PORT, DEV_MAIL_PASS, DEV_MAIL_HOST } = process.env;



module.exports = class Email {
  constructor(user,resetCode = 1234) {
    this.to = user.email;
    this.firstName = user.fullName.split(' ')[0];
    this.from = `${(process.env.NODE_ENV !== "production")? DEV_MAIL_USER : process.env.EMAIL_USERNAME}`;
    this.resetCode = resetCode;
  }

  //read file Async
  readFilePro(path){
    return new Promise((result,reject)=>{
      fs.readFile(path,"utf-8",(err,data)=>{
        if(err){
          reject(err)
        } else{
          result(data)
        }
      })
    })
  }

  newTransport() {
    if (process.env.NODE_ENV !== 'production') { 
      // Sendgrid
      return(nodemailer.createTransport({
        host:DEV_MAIL_HOST,
        port: DEV_MAIL_PORT,
        auth: {
          user: DEV_MAIL_USER,
          pass: DEV_MAIL_PASS
        }
      }));
    }else{
      return(nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass:process.env.EMAIL_PASSWORD
        }
      }));
    }
  }
 
  // Send the actual email
  // async send(template, subject) {
  //   // 1) Render HTML based on a pug template
  //   const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
  //     firstName: this.firstName,
  //     url: this.url,
  //     subject
  //   });

  

  //   // 2) Define email options
  //   const mailOptions = {
  //     from:this.from,
  //     to: this.to,
  //     subject,
  //     html,
  //     text: htmlToText.fromString(html)
  //   };

  //   // 3) Create a transport and send email
  //   await this.newTransport().sendMail(mailOptions);
  // }


async send(subject){
  // 1) rendering html
  let htmlTxt = await this.readFilePro(`${__dirname}/../views/html/welcom.html`)


  // 2) replacing the parameters with real values
  let setFirstName = htmlTxt.replace(/{%USERNAME%}/g,this.firstName)
  let setCode = setFirstName.replace(/{%HOMEPAGE%}/g,process.env.TREEN_CLIENT)
  console.log(setCode)


  // 3) Define email options
const mailOptions1 = {
  from: this.from,
  to: this.to,
  subject,
  html:setCode,
  text:"Reset Password Code"
};

// 4) Create a transport and send email
await this.newTransport().sendMail(mailOptions1);

 
}


  //send email for password reset code
  async send2(subject){
    // 1) rendering html
    let htmlTxt = await this.readFilePro(`${__dirname}/../views/html/resetCode.html`)


    // 2) replacing the parameters with real values
    let setFirstName = htmlTxt.replace(/{%HOMEPAGE%}/g,process.env.TREEN_CLIENT)
    let setFirstName2 = setFirstName.replace(/{%USERNAME%}/g,this.firstName)
    let setCode = setFirstName2.replace(/{%RESETCODE%}/g,this.resetCode)
    // console.log(setCode)

    
    // 3) Define email options
  const mailOptions = {
    from: this.from,
    to: this.to,
    subject,
    html:setCode,
    text:"Reset Password Code"
  };

  // 4) Create a transport and send email
  await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the 3Green Family!');
  }

  async sendPasswordReset() {
    await this.send2(
      'Your password reset code (valid for only 10 minutes)'
    );
  }
};
