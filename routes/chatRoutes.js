const express = require('express');

const authController = require('../controllers/authController');
const {auth} = require('../middlewares/authenticate')
const chatController = require('../controllers/chatController');

const router = express.Router();

//Get all Sales Rep
router.get(
  '/messages/user/:user',
  auth,
  chatController.getMessages
);

router.get(
  '/messages/room/:room',
  auth,
  chatController.getRoomMessages
);

// Get performance of single sales rep
router.post(
  '/send',
  auth,
  chatController.sendMessage
);

router.put(
  '/read/:id',
  auth,
  chatController.markAsRead
);

router.put(
  '/:id',
  auth,
  chatController.updateMessage
);

router.delete(
  '/:id',
  auth,
  chatController.deleteMessage
);

module.exports = router;
