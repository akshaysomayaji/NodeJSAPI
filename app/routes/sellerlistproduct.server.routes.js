const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/productlist.controller");

// Create product
// POST /api/products
router.post("/", productCtrl.createProduct);

// List products
// GET /api/products?q=search&page=1&limit=20&category=...&stockstatus=...&productstatus=...
router.get("/", productCtrl.listProducts);

// Get single product
// GET /api/products/:id
router.get("/:id", productCtrl.getProductById);

// Update product (full/partial)
// PUT /api/products/:id
router.put("/:id", productCtrl.updateProduct);

// Toggle active/inactive
// PATCH /api/products/:id/toggle-status
router.patch("/:id/toggle-status", productCtrl.toggleStatus);

// Set stock status manually
// PATCH /api/products/:id/stockstatus
// Body: { stockstatus: "In Stock" | "Low Stock" | "Out of Stock" }
router.patch("/:id/stockstatus", productCtrl.setStockStatus);

// Delete product
// DELETE /api/products/:id
router.delete("/:id", productCtrl.deleteProduct);

module.exports = router;