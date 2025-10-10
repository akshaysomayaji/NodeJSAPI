// routes/buyer.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/buyer.controller');

// Create
router.post('/', ctrl.createBuyer);

// List (search/filter/pagination)
router.get('/', ctrl.listBuyers);

// Get single
router.get('/:id', ctrl.getBuyerById);

// Partial update
router.patch('/:id', ctrl.updateBuyer);

// Update status only
router.patch('/:id/status', ctrl.updateStatus);

// Delete
router.delete('/:id', ctrl.deleteBuyer);

module.exports = router;