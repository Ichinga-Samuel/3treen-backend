const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

//route for password reset
router.patch('/resetPassword/:token', authController.resetPassword);

//route for forgot password
router.post('/forgotPassword', authController.forgotPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

router.patch('/updateUser', authController.protect, userController.user_update);

router.route('/:id').get(userController.getUser);

router.route('/').get(userController.getAllUsers);

module.exports = router;
