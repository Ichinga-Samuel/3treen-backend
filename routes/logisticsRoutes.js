const express = require('express');

const authController = require('../controllers/authController');
const {auth} = require('../middlewares/authenticate')
const logisticsController = require('../controllers/logisticsController');

const router = express.Router();

router.post('/add',
    auth,
    authController.accessControl,
    logisticsController.addCompany
);

router.get('/getCompany/:id',
    auth,
    authController.accessControl,
    logisticsController.getCompany
);

router.get('/getAllCompany',
    auth,
    authController.accessControl,
    logisticsController.getAllCompanies
);

router.get('/getCompanyByState/:state',
    auth,
    authController.accessControl,
    logisticsController.getCompaniesByState
);

router.delete('/remove/:id',
    auth,
    authController.accessControl,
    logisticsController.removeCompany
);

router.put('/update/:id',
    auth,
    authController.accessControl,
    logisticsController.updateCompany
);

router.put('/rate/:id',
    auth,
    logisticsController.rateCompany
);

module.exports = router;
