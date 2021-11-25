const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const salesRepProtect = require('../middlewares/salesRepProtect');
const {auth} = require('../middlewares/authenticate')

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/admin/dashboard', userController.getDashboard);

router.route('/getUser/:id').get(userController.getUser);

router.post('/signUpUser',  authController.signup);

router.post(
  '/signUpAsCompany',
  authController.setCompany,
  authController.signup
);

router.get('/inviteAdmin/:id', auth, authController.inviteAdmin);

router.get('/activate/:token', authController.activate)

//route for password reset
router.post('/resetPassword/', authController.resetPassword);

//route for forgot password
router.post('/forgotPassword', authController.forgotPassword);

router.get('/test', auth, (req, res,)=>{
  console.log(new Date(req.user.iat), new Date(req.user.exp))
  res.status(200).json({msg: "ok ok ok"})
})

//update password
router.patch('/updateMyPassword', auth, authController.updatePassword);

//
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

router.patch(
  '/updateMe',
  auth,
  authController.getUser,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.route('/').get(userController.getAllUsers);
router.route('/allUsers').get(userController.getAllRawUsers);

router.patch(
  '/:userId/:role',
  auth,
  authController.getUser,
  authController.accessControl,
  userController.updateUserRole
);

router.get(
  '/:role',
  auth,
  authController.getUser,
  authController.accessControl,
  userController.getUsersBasedOnRole
);

module.exports = router;
