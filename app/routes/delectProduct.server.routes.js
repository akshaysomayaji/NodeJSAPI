const express = require("express");

module.exports = (db) => {
  const router = express.Router();
  const productController = require("../controllers/product.controller")(db);

  // Create new product
  router.post("/", productController.createProduct);

  // Get all active products
  router.get("/", productController.getAllProducts);

  // Get product by ID
  router.get("/:id", productController.getProductById);

  // Soft delete product (mark as deleted)
  router.put("/:id/delete", productController.softDeleteProduct);

  // Permanently delete product
  router.delete("/:id", productController.deleteProduct);

  return router;
};