const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/home.controller");

// public endpoints
router.get("/banner", ctrl.getBanner);            // GET /api/home/banner
router.get("/categories", ctrl.getCategories);    // GET /api/home/categories
router.get("/suppliers", ctrl.getSuppliers);      // GET /api/home/suppliers?q=tech
router.get("/requests", ctrl.getRequests);        // GET /api/home/requests

// admin / management endpoints (use auth middleware in production)
router.post("/", ctrl.createEntry);               // POST /api/home  (create banner/category/supplier/request)
router.patch("/:id", ctrl.updateEntry);           // PATCH /api/home/:id
router.delete("/:id", ctrl.deleteEntry);          // DELETE /api/home/:id

module.exports = router;