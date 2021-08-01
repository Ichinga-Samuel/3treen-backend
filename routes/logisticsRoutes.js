const express = require('express');

const authController = require('../controllers/authController');
const logisticsController = require('../controllers/logisticsController');

const router = express.Router();

router.post('/add',
    authController.protect,
    authController.accessControl,
    logisticsController.addCompany
);

router.delete('/remove/:id',
    authController.protect,
    authController.accessControl,
    logisticsController.removeCompany
);

router.put('/update/:id',
    authController.protect,
    authController.accessControl,
    logisticsController.updateCompany
);

router.put('/rate/:id',
    authController.protect,
    logisticsController.rateCompany
);

module.exports = router;