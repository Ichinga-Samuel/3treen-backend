const express = require('express');
const router2 = express.Router();
const searchController = require('../controllers/searchController');

router2.route('/').post(searchController.getByName);

module.exports = router2;
