const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route('/:id')
  .get(productController.getSingleProduct)
  .patch(
    authController.protect,
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(authController.protect,productController.deleteProduct);

module.exports = router;
