const express = require('express');
const router = express.Router();
const controller = require('../controllers/returnpolicy.controller');

router.get('/policy', controller.getPolicy);

router.post('/request', controller.createRequest);

router.get('/requests', controller.listRequests);

router.get('/requests/:requestId', controller.getRequestById);

module.exports = router;