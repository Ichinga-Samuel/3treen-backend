const express = require('express');
const messagesContoller = require('../controllers/messagesController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', messagesContoller.getAllMessages);

router.get('/myChats', authController.protect, messagesContoller.getMyMessages);

router.post(
  '/messageUser/:reciever',
  authController.protect,
  messagesContoller.createMessage
);

module.exports = router;
