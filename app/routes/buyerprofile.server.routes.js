// routes/buyer.actions.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/buyer.actions.controller');

// Read buyer profile
router.get('/:id', ctrl.getBuyerProfile);

// Approve verification
router.post('/:id/verify/approve', ctrl.approveVerification);

// Deny verification
router.post('/:id/verify/deny', ctrl.denyVerification);

// Toggle suspend / unsuspend
router.post('/:id/suspend', ctrl.toggleSuspend);

// Approve payment (payout)
router.post('/:id/payment/approve', ctrl.approvePayment);

module.exports = router;