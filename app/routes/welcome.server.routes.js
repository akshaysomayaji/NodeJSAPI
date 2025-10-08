const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/onboarding.controller");

// Save selection (create or update per user)
router.post("/", ctrl.createOrUpdatePreference);

// Get by record id
router.get("/:id", ctrl.getPreferenceById);

// Get by userId (query param)
router.get("/", ctrl.getPreferenceByUser);

// Admin: list all
router.get("/all/list", ctrl.listPreferences);

module.exports = router;