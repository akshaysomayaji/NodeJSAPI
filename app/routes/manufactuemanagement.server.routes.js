// routes/manufacturer.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/manufacturer.controller');

// Create
router.post('/', ctrl.createManufacturer);

// List (search/filter/pagination)
router.get('/', ctrl.listManufacturers);

// Get single
router.get('/:id', ctrl.getManufacturerById);

// Partial update
router.patch('/:id', ctrl.updateManufacturer);

// Update status only (badge)
router.patch('/:id/status', ctrl.updateStatus);

// Delete
router.delete('/:id', ctrl.deleteManufacturer);

module.exports = router;