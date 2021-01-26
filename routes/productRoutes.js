const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProducts);

router
  .route('/:id')
  .get(productController.getAllProducts)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);
