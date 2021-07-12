const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const salesRepProtect = require('../middlewares/salesRepProtect');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/admin/dashboard', userController.getDashboard);

router.route('/getUser/:id').get(userController.getUser);
router.post(
  '/signUpUser',
  authController.protect,
  salesRepProtect.accessControl,
  authController.signup
);

router.post(
  '/signUpAsCompany',
  authController.setCompany,
  authController.signup
);

//confirm password reset code
router.post('/confirmCode/:code', authController.confirmResetCode);

//route for password reset
router.patch('/resetPassword/:code', authController.resetPassword);

//route for forgot password
router.post('/forgotPassword', authController.forgotPassword);

//update password
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

//
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.get(
  '/:role',
  authController.protect,
  authController.accessControl,
  userController.getUsersBasedOnRole
);

router.route('/').get(userController.getAllUsers);

router.patch(
  '/:userId/:role',
  authController.protect,
  authController.accessControl,
  userController.updateUserRole
);

module.exports = router;
