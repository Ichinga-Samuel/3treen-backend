const {emailService} = require("../utils/messanger");
const catchAsync = require("../utils/catchAsync");
const multer  = require('multer')

const sender = process.env.MAILJET_ADDRESS
const senders = process.env.VALIDATED_ADDRESSES.split(',')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage})

/*
    fields
    subject: the subject of the mail
    recipient: email of a receiver or comma separated emails of multiple receivers
    message: email as plain text
    emailHtml: email to be sent as a html file *(message and emailHtml is optional but you must specify either of them)
    priority: either of (low | normal | high) *optional
    attachments: files to be attached to mail *(optional)
    from: email address of sender *(this is optional but if specified it should be in the list validated email addresses. met @Ichinga-Samuel to add any new email address to the smtp server)

 */

exports.mailAttachments = upload.any()

exports.sendMail = catchAsync(async (req, res, next) =>{
    req.body.attachments = []
     req.files.forEach((file) => {
         if(file.fieldname === 'emailHtml'){req.body.html = file.buffer}
         else{
             req.body.attachments.push({
                 filename: file.originalname,
                 content: file.buffer,
             })
         }
    })
    let from = req.body.from && senders.includes(req.body.from) ? req.body.from : sender;
    const mailer = new emailService(from);
    let sent = await mailer.send(req.body)
    res.status(200).json({status: "success", message: `Email Successfully Sent To ${sent.join(', ')}`})
})

