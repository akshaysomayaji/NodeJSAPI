// routes/category.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/category.controller');

// Create category
router.post('/', ctrl.createCategory);

// List (search/filter/pagination)
router.get('/', ctrl.listCategories);

// Get single
router.get('/:id', ctrl.getCategoryById);

// Partial update
router.patch('/:id', ctrl.updateCategory);

// Toggle status (activate/deactivate)
router.patch('/:id/status', ctrl.toggleStatus);

// Delete
router.delete('/:id', ctrl.deleteCategory);

module.exports = router;