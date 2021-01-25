const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

//route for password reset
router.patch('/resetPassword/:token', authController.resetPassword);

//route for forgot password
router.post('/forgotPassword', authController.forgotPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/updateUser', authController.protect, userController.user_update);

router.route('/:id').get(userController.getUser);

module.exports = router;
