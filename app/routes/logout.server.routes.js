const express = require("express");
const router = express.Router();
const controller = require("../controllers/logoutdetail.controller");

// Create logout confirmation request
router.post("/request", controller.requestLogout);

// Confirm logout (user clicked "Logout")
router.put("/confirm/:id", controller.confirmLogout);

// Get logout history for a specific seller
router.get("/history/:sellerid", controller.getLogoutHistory);

module.exports = router;