const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const productViews = require('../middlewares/prodViewMiddleware');
const {auth} = require("../middlewares/authenticate");

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    auth,
    productController.uploadProductImages,
    productController.createProduct
  );

router
  .route('/vendorStats')
  .get(auth, productController.vendorStats);

router
  .route('/vendorProducts')
  .get(auth, productController.vedorProducts);

router
  .route('/:id')
  .get(productController.getSingleProduct)
  .patch(auth, productController.updateProduct)
  .delete(auth, productController.deleteProduct);

module.exports = router;
