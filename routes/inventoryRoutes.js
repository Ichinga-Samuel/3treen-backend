const express = require('express');
const {search, all} = require('../controllers/inventoryController');
const {auth} = require('../middlewares/authenticate')
const router = express.Router()

router.get('/search', auth, search)

router.get('/all', auth, all)

module.exports = router
