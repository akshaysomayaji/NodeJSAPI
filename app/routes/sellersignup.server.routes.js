
const express = require("express");
const router = express.Router();
const profileCtrl = require("../controllers/sellerprofile.controller");

// Create profile
// POST /api/sellers
router.post("/", profileCtrl.createProfile);

// Find / list profiles (by email or name)
// GET /api/sellers?emailid=... or ?storename=...
router.get("/", profileCtrl.findProfiles);

// Get single profile
// GET /api/sellers/:id
router.get("/:id", profileCtrl.getProfileById);

// Update full profile
// PUT /api/sellers/:id
router.put("/:id", profileCtrl.updateProfile);

// Partial update (logo upload result, verification changes)
// PATCH /api/sellers/:id
router.patch("/:id", profileCtrl.patchProfile);

// Delete profile
// DELETE /api/sellers/:id
router.delete("/:id", profileCtrl.deleteProfile);

module.exports = router;