const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {auth} = require('../middlewares/authenticate')
const categoryController = require('../controllers/categoryController');
const categoryFilter = require("../controllers/categoryFilterDisplayController");

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(
    auth,
    authController.accessControl,
    categoryController.createCategory
  );

  router
    .route("/categoryFilter")
    .get(categoryFilter.categoryFilter)

router.use(auth, authController.accessControl);

router
  .route('/:id')
  .delete(categoryController.deleteCategory)
  .patch(categoryController.updateCategory)
  .get(categoryController.getSingleCategory);

module.exports = router;
