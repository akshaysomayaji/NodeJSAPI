const express = require("express");
const router = express.Router();
const orderCtrl = require("../controllers/order.controller");

// Create order
// POST /api/orders
router.post("/", orderCtrl.createOrder);

// List orders
// GET /api/orders?page=1&limit=20&orderstatus=Shipped&paymentstatus=Paid
router.get("/", orderCtrl.listOrders);

// Get single order
// GET /api/orders/:id
router.get("/:id", orderCtrl.getOrderById);

// Update full order
// PUT /api/orders/:id
router.put("/:id", orderCtrl.updateOrder);

// Quick update (orderstatus/paymentstatus/expected delivery)
// PATCH /api/orders/:id/status
router.patch("/:id/status", orderCtrl.updateStatus);

// Buyer sets or clears return request
// PATCH /api/orders/:id/return
// Body: { returnrequest: true }
router.patch("/:id/return", orderCtrl.setReturnRequest);

// Admin respond to return request (accept/deny)
// PATCH /api/orders/:id/return/respond
// Body: { action: "accept"|"deny", decisionBy: "adminId", notes: "optional notes" }
router.patch("/:id/return/respond", orderCtrl.respondReturnRequest);

// Cancel order
// POST /api/orders/:id/cancel
// Body: { cancelreason: "...", cancelledby: "adminOrBuyerId" }
router.post("/:id/cancel", orderCtrl.cancelOrder);

// Delete (optional)
// DELETE /api/orders/:id
router.delete("/:id", orderCtrl.deleteOrder);

module.exports = router;