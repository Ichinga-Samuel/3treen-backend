const nodemailer = require('nodemailer');
const inlinecss = require('nodemailer-juice');
const { MAILJET_USER, MAILJET_PORT, MAILJET_PASSWORD, MAILJET_HOST} = process.env;

exports.emailService = class Email{
    constructor(sender){
        this.from = sender
    }
    transporter() {
        return(nodemailer.createTransport({
            host:MAILJET_HOST,
            port: MAILJET_PORT,
            auth: {
                user: MAILJET_USER,
                pass: MAILJET_PASSWORD
            }
        }));
    }

    async send(body){
        const mailOptions = {
            from: this.from,
            to: body.recipient,
            subject: body.subject,
            text: body.text,
            html: body.message || body.html,
            priority: body.priority || "normal",
            attachments: body.attachments
        };

        // Create a transport and send email
        this.transporter().use('compile', inlinecss());
        let res = await this.transporter().sendMail(mailOptions);
        return res.accepted
    }
}