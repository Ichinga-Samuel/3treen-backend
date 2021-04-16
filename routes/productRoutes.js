const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const productViews = require('../middlewares/prodViewMiddleware');

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    productViews.setUploader,
    productController.uploadProductImages,
    productController.createProduct
  );

router
  .route('/vendorStats')
  .get(authController.protect, productController.vendorStats);

router
  .route('/:id')
  .get(
    authController.protect,
    productViews.handleView,
    productController.getSingleProduct
  )
  .patch(
    authController.protect,
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

module.exports = router;
