const Product = require('../models/productModel');
const factory = require('../controllers/handlerFactory');

exports.createProduct = factory.createOne(Product);

exports.getAllProducts = factory.getAll(Product);

exports.getSingleProduct = factory.getOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
