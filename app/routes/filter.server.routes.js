const express = require('express');
const router = express.Router();
const controller = require('../controllers/orders.controller');

// POST /api/orders/filter
router.post('/filter', controller.filterOrders);

// optional create for testing
router.post('/create', controller.createOrder);

module.exports = router;