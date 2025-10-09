const express = require('express');
const router = express.Router();
const controller = require('../controllers/returns.controller');

// get policy used to build UI
router.get('/policy', controller.getPolicy);

// create a return request (user)
router.post('/request', controller.createRequest);

// list recent requests for seller (table)
router.get('/recent', controller.recentRequests);

// admin update status
router.put('/:id/status', controller.updateStatus);

module.exports = router;