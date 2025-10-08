const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/sellerProfile.controller");

// CRUD endpoints
router.post("/", ctrl.createSeller);           // POST /api/sellers
router.get("/", ctrl.getAllSellers);           // GET /api/sellers
router.get("/:id", ctrl.getSellerById);        // GET /api/sellers/:id
router.patch("/:id", ctrl.updateSeller);       // PATCH /api/sellers/:id
router.delete("/:id", ctrl.deleteSeller);      // DELETE /api/sellers/:id

module.exports = router;