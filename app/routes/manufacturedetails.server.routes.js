// routes/manufacture.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/manufacture.controller');

// Create a manufacturer (single model record that includes a product row)
router.post('/', ctrl.createManufacture);

// List (filter by query params: companyname, category, stockstatus)
router.get('/', ctrl.listManufactures);

// Get single
router.get('/:id', ctrl.getManufactureById);

// Partial update
router.patch('/:id', ctrl.updateManufacture);

// Update only stock fields (stockstatus / stockquantity)
router.patch('/:id/stock', ctrl.updateStockStatus);

// Delete
router.delete('/:id', ctrl.deleteManufacture);

module.exports = router;