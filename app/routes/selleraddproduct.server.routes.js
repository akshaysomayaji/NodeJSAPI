// routes/product.routes.js
const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/product.controller");

// Create product
// POST /api/products
router.post("/", productCtrl.createProduct);

// List products (GET /api/products?page=1&limit=20&category=...&search=...)
router.get("/", productCtrl.listProducts);

// Get single product
// GET /api/products/:id
router.get("/:id", productCtrl.getProductById);

// Update product (full/partial)
// PUT /api/products/:id
router.put("/:id", productCtrl.updateProduct);

// Toggle/set low stock alert or units
// PATCH /api/products/:id/lowstock
router.patch("/:id/lowstock", productCtrl.setLowStock);

// Set product status (Active/Inactive) - Publish / Unpublish
// PATCH /api/products/:id/status
router.patch("/:id/status", productCtrl.setStatus);

// Delete product
// DELETE /api/products/:id
router.delete("/:id", productCtrl.deleteProduct);

module.exports = router;