const express = require("express");
const router = express.Router();
const dashCtrl = require("../controllers/sellerdashboard.controller");

// Create dashboard
// POST /api/dashboard
router.post("/", dashCtrl.createDashboard);

// Get dashboard by id
// GET /api/dashboard/:id
router.get("/:id", dashCtrl.getDashboardById);

// Find dashboards by query (e.g. sellername)
// GET /api/dashboard?sellername=Joe
router.get("/", dashCtrl.findDashboard);

// Update full dashboard
// PUT /api/dashboard/:id
router.put("/:id", dashCtrl.updateDashboard);

// Increment counters (ordersToday, ordersDelivered, etc.)
// PATCH /api/dashboard/:id/increment
router.patch("/:id/increment", dashCtrl.incrementStats);

// Add recent order to recentorders list
// POST /api/dashboard/:id/recent-order
router.post("/:id/recent-order", dashCtrl.addRecentOrder);

// Add or update a top selling product
// POST /api/dashboard/:id/top-selling
router.post("/:id/top-selling", dashCtrl.addTopSelling);

// Delete dashboard (optional, admin only)
// DELETE /api/dashboard/:id
router.delete("/:id", dashCtrl.deleteDashboard);

module.exports = router;