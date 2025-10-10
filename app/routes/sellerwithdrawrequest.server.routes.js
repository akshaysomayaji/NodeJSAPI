// routes/sellerWithdraw.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sellerWithdraw.controller');

// Create withdraw request
router.post('/', ctrl.createWithdraw);

// List withdraws (search/filter/pagination)
router.get('/', ctrl.listWithdraws);

// Get single
router.get('/:id', ctrl.getWithdraw);

// Approve (admin action)
router.post('/:id/approve', ctrl.approveWithdraw);

// Deny (admin action)
router.post('/:id/deny', ctrl.denyWithdraw);

// Complete (after transaction)
router.post('/:id/complete', ctrl.completeWithdraw);

// Delete
router.delete('/:id', ctrl.deleteWithdraw);

module.exports = router;