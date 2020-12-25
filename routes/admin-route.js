const express = require('express')
const router = express.Router()
const productController = require('../controller/products')


router.get('/add-products', productController.postAddProduct);
router.get('/products', productController.getAddProduct);



module.exports = router