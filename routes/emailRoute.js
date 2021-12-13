const express = require('express');
const {sendMail, mailAttachments} = require('../controllers/emailController');
const authController = require('../controllers/authController');
const {auth} = require('../middlewares/authenticate')

const router = express.Router();

router.post('/mailuser',
    mailAttachments,
    auth,
    authController.accessControl,
    sendMail)

module.exports = router;