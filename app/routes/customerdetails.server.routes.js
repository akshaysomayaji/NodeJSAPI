// routes/orderdetail.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderdetail.controller');

// Create
router.post('/', ctrl.createOrderDetail);

// Read list (with optional query filters)
router.get('/', ctrl.listOrderDetails);

// Read single
router.get('/:id', ctrl.getOrderDetailById);

// Update full/partial
router.patch('/:id', ctrl.updateOrderDetail);

// Update only status
router.patch('/:id/status', ctrl.updateOrderStatus);

// Delete
router.delete('/:id', ctrl.deleteOrderDetail);

module.exports = router;