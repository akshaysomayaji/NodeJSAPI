const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');

router.get('/:productId', controller.getProductById);

// POST create product (admin)
router.post('/', controller.createProduct);

// PUT update product (admin)
router.put('/:productId', controller.updateProduct);

// GET list/search
router.get('/', controller.listProducts);

module.exports = router;