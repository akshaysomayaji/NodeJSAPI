// routes/seller.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/seller.controller');

// Create seller
router.post('/', ctrl.createSeller);

// List (search/filter/pagination)
router.get('/', ctrl.listSellers);

// Get single
router.get('/:id', ctrl.getSellerById);

// Partial update
router.patch('/:id', ctrl.updateSeller);

// Update status / productcount
router.patch('/:id/status', ctrl.updateStatus);

// Delete
router.delete('/:id', ctrl.deleteSeller);

module.exports = router;