// routes/sellerDetail.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sellerDetail.controller');

// Create
router.post('/', ctrl.createSeller);

// List (search/filter/pagination)
router.get('/', ctrl.listSellers);

// Get single
router.get('/:id', ctrl.getSellerById);

// Partial update
router.patch('/:id', ctrl.updateSeller);

// Update status / internal notes
router.patch('/:id/status', ctrl.updateStatus);

// Approve verification (quick action)
router.post('/:id/approve', ctrl.approveVerification);

// Delete
router.delete('/:id', ctrl.deleteSeller);

module.exports = router;