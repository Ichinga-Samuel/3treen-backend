const express = require('express');

const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');

const router = express.Router();

//Get all Sales Rep
router.get(
  '/messages/user/:user',
  authController.protect,
  chatController.getMessages
);

router.get(
  '/messages/room/:room',
  authController.protect,
  chatController.getRoomMessages
);

// Get performance of single sales rep
router.post(
  '/send/:user',
  authController.protect,
  chatController.sendMessage
);

router.put(
  '/read/:id',
  authController.protect,
  chatController.markAsRead
);

router.put(
  '/:id',
  authController.protect,
  chatController.updateMessage
);

router.delete(
  '/:id',
  authController.protect,
  chatController.deleteMessage
);

module.exports = router;
