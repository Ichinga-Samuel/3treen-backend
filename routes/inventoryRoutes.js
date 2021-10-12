const express = require('express');
const {search, all} = require('../controllers/inventoryController');
const router = express.Router()

router.get('/search', search)

router.get('/all', all)

module.exports = router
