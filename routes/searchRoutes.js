const express = require('express');
const router2 = express.Router();
const searchController = require('../controllers/searchController');

router2.route('/productSearch')
    .get(searchController.getSearchResult);

module.exports = router2;
