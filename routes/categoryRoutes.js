const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(
    authController.protect,
    authController.accessControl,
    categoryController.createCategory
  );

router.use(authController.protect, authController.accessControl);

router
  .route('/:id')
  .delete(categoryController.deleteCategory)
  .patch(categoryController.updateCategory)
  .get(categoryController.getSingleCategory);

module.exports = router;
