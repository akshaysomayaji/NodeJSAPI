const express = require('express');
const router = express.Router();
const controller = require('../controllers/withdrawals.controller');

router.post('/request', controller.requestWithdrawal);
router.get('/recent', controller.recentRequests);
router.get('/balance/:sellerId', controller.getBalance);
router.patch('/:id/status', controller.updateStatus);

module.exports = router;