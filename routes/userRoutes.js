const express = require('express');

const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');
const salesRepProtect = require('../middlewares/salesRepProtect');
const {auth} = require('../middlewares/authenticate')

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);

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


//update password
router.patch('/updateMyPassword', auth, authController.updatePassword);

//
router.get(
  '/me',
  auth,
  userController.getMe,
<<<<<<< HEAD
  userController.getUser,
  userController.getAllProducts
);

router.get(
  '/myproducts',
  auth,
  userController.getAllProducts
);

router.get(
  '/myproducts/:product_id',
  auth,
  require('../controllers/adminController').getVendorByProduct
||||||| ec65488
  userController.getUser
=======
  userController.getUser,
  orderController.getUserOrders
>>>>>>> 27986f1ff310cc15a4eccb8ceaea0993a33115d7
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
