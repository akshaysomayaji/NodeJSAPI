const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/businessverification.controller");

// Create verification (seller submits numbers and doc URLs)
// POST /api/business-verification
router.post("/", ctrl.createVerification);

// List / filter verifications
// GET /api/business-verification?sellerid=...&verificationstatus=Pending
router.get("/", ctrl.listVerifications);

// Get single verification
// GET /api/business-verification/:id
router.get("/:id", ctrl.getVerificationById);

// Update verification (seller updates numbers or doc URLs)
// PUT /api/business-verification/:id
router.put("/:id", ctrl.updateVerification);

// Admin respond (approve/reject)
// PATCH /api/business-verification/:id/respond
// Body: { action: "approve"|"reject", verifiedBy: "adminId", rejectionReason: "..." }
router.patch("/:id/respond", ctrl.respondVerification);

// Delete
router.delete("/:id", ctrl.deleteVerification);

module.exports = router;