const Category = require('../models/categoryModel');
const factory = require('../controllers/handlerFactory');

exports.getAllCategories = factory.getAll(Category);

exports.getSingleCategory = factory.getOne(Category);

exports.createCategory = factory.createOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
