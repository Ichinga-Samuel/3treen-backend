const express = require('express');
const {sendMail, mailAttachments} = require('../controllers/emailController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/mailuser',
    mailAttachments,
    authController.protect,
    authController.accessControl,
    sendMail)

module.exports = router;