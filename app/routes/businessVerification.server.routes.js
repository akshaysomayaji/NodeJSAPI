const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/businessVerification.controller");

router.post("/", ctrl.uploadMiddleware, ctrl.createVerification);

// Get single verification by id
router.get("/:id", ctrl.getVerification);

// Admin listing (optional status filter): e.g. /api/verifications?status=Pending
router.get("/", ctrl.listVerifications);

// Admin update status/notes
router.patch("/:id", ctrl.updateVerification);

// Replace documents (allow file fields) for existing entry
router.post("/:id/documents", ctrl.uploadMiddleware, ctrl.replaceDocuments);

module.exports = router;