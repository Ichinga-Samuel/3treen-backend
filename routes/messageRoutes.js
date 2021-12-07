const express = require('express');
const messagesContoller = require('../controllers/messagesController');
const authController = require('../controllers/authController');
const {auth} = require('../middlewares/authenticate')

const router = express.Router();

router.get('/', messagesContoller.getAllMessages);

router.get('/myChats', auth, messagesContoller.getMyMessages);

router.post(
  '/messageUser/:reciever',
  auth,
  messagesContoller.createMessage
);

router.get(
  '/userChat/:roomId',
  auth,
  messagesContoller.getChatsBetweenUsers
);

module.exports = router;
