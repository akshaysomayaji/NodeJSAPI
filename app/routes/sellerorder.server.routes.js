const express = require("express");
const router = express.Router();
const orderCtrl = require("../controllers/order.controller");

// Create order
router.post("/", orderCtrl.createOrder);

// List orders (GET /api/orders?page=1&limit=20&orderstatus=Shipped&paymentstatus=Paid)
router.get("/", orderCtrl.listOrders);

// Get single order
router.get("/:id", orderCtrl.getOrderById);

// Update full order
router.put("/:id", orderCtrl.updateOrder);

// Quick status update
router.patch("/:id/status", orderCtrl.updateStatus);

// Buyer: request/cancel return
router.patch("/:id/return", orderCtrl.setReturnRequest);

// Admin: respond to return request (accept/deny)
// Body: { action: "accept"|"deny", decisionBy: "adminId", notes: "..." }
router.patch("/:id/return/respond", orderCtrl.respondReturnRequest);

// Cancel order
// Body: { cancelreason: "...", cancelledby: "adminOrBuyerId" }
router.post("/:id/cancel", orderCtrl.cancelOrder);

// Delete order (optional)
router.delete("/:id", orderCtrl.deleteOrder);

module.exports = router;