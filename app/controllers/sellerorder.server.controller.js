const { Op } = require("sequelize");
const { Order, sequelize } = require("../models"); // adjust path to your models/index.js

// Helper — compute totals from products array
// products: [{ productId, name, qty, pricePerUnit, subtotal? }, ...]
function computeTotals(products = [], shippingAmount = 0) {
  let subtotal = 0;
  for (const p of products) {
    const qty = Number(p.qty ?? p.quantity ?? 0);
    const price = Number(p.pricePerUnit ?? p.price ?? 0);
    const itemSubtotal = Number(p.subtotal ?? qty * price);
    subtotal += itemSubtotal;
  }
  const shipping = Number(shippingAmount ?? 0);
  const total = subtotal + shipping;
  return { subtotal, total };
}

// Simple order number generator
// NOTE: For production, use a robust generator or DB sequence. This is a quick approach.
async function generateOrderNumber() {
  // Use timestamp + random suffix to avoid collisions
  const ts = Date.now().toString().slice(-6);
  const rand = Math.floor(Math.random() * 900 + 100).toString(); // 100-999
  return #${ts}${rand};
}

module.exports = {
  // Create order
  createOrder: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const {
        customername,
        customeravatar,
        customernumber,
        customeremail,
        products = [],
        shippingamount = 0,
        paymentstatus,
        orderstatus,
        internalnotes,
        buyerid,
        sellerid,
      } = req.body;

      const { subtotal, total } = computeTotals(products, shippingamount);
      const ordernumber = await generateOrderNumber();

      const newOrder = await Order.create(
        {
          ordernumber,
          customername,
          customeravatar: customeravatar || null,
          customernumber: customernumber || null,
          customeremail: customeremail || null,
          products,
          subtotalamount: subtotal,
          shippingamount,
          totalamount: total,
          paymentstatus: paymentstatus || "Pending",
          orderstatus: orderstatus || "Pending",
          internalnotes: internalnotes || null,
          buyerid: buyerid || null,
          sellerid: sellerid || null,
        },
        { transaction: t }
      );

      await t.commit();
      return res.status(201).json({ success: true, data: newOrder });
    } catch (err) {
      await t.rollback();
      console.error("createOrder error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // List orders with pagination + filters
  listOrders: async (req, res) => {
    try {
      const page = Math.max(1, Number(req.query.page || 1));
      const limit = Math.min(100, Number(req.query.limit || 20));
      const offset = (page - 1) * limit;

      const where = {};
      if (req.query.orderstatus) where.orderstatus = req.query.orderstatus;
      if (req.query.paymentstatus) where.paymentstatus = req.query.paymentstatus;
      if (req.query.ordernumber) where.ordernumber = req.query.ordernumber;
      if (req.query.customername) {
        where.customername = { [Op.iLike || Op.like]: %${req.query.customername}% };
      }

      const { rows, count } = await Order.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return res.json({ success: true, data: rows, meta: { total: count, page, limit } });
    } catch (err) {
      console.error("listOrders error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Get single order
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });
      return res.json({ success: true, data: order });
    } catch (err) {
      console.error("getOrderById error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Update whole order (recalc totals if products/shipping changed)
  updateOrder: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, { transaction: t });
      if (!order) {
        await t.rollback();
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      const updates = { ...req.body };

      if (updates.products || typeof updates.shippingamount !== "undefined") {
        const products = updates.products ?? order.products;
        const shipping = typeof updates.shippingamount !== "undefined" ? updates.shippingamount : order.shippingamount;
        const { subtotal, total } = computeTotals(products, shipping);
        updates.subtotalamount = subtotal;
        updates.totalamount = total;
      }

      if (updates.orderstatus) {
        updates.isshipped = updates.orderstatus === "Shipped";
        updates.isdelivered = updates.orderstatus === "Delivered";
      }

      await order.update(updates, { transaction: t });
      await t.commit();
      return res.json({ success: true, data: order });
    } catch (err) {
      await t.rollback();
      console.error("updateOrder error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Quick status update (orderstatus / paymentstatus / expected delivery)
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { orderstatus, paymentstatus } = req.body;
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });

      const updates = {};
      if (orderstatus) {
        updates.orderstatus = orderstatus;
        updates.isshipped = orderstatus === "Shipped";
        updates.isdelivered = orderstatus === "Delivered";
      }
      if (paymentstatus) updates.paymentstatus = paymentstatus;

      await order.update(updates);
      return res.json({ success: true, data: order });
    } catch (err) {
      console.error("updateStatus error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Buyer sets a return request
  setReturnRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const { returnrequest = true } = req.body;
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });

      order.isreturnrequested = Boolean(returnrequest);
      order.returnstatus = returnrequest ? "Pending" : "None";
      await order.save();
      return res.json({ success: true, data: order });
    } catch (err) {
      console.error("setReturnRequest error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Admin responds to return request
  respondReturnRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const { action, decisionBy, notes } = req.body; // action: "accept" or "deny"
      if (!["accept", "deny"].includes((action || "").toLowerCase())) {
        return res.status(400).json({ success: false, message: "Invalid action" });
      }

      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });
      if (!order.isreturnrequested) return res.status(400).json({ success: false, message: "No return request present" });

      const newStatus = action.toLowerCase() === "accept" ? "Accepted" : "Denied";
      order.returnstatus = newStatus;
      order.returndecisionby = decisionBy || null;
      order.returndecisionat = new Date();
      order.returndecisionnotes = notes || null;

      if (newStatus === "Accepted") order.orderstatus = "ReturnApproved";
      if (newStatus === "Denied") order.orderstatus = "ReturnDenied";

      await order.save();
      return res.json({ success: true, data: order });
    } catch (err) {
      console.error("respondReturnRequest error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Cancel order (admin or buyer)
  cancelOrder: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { cancelreason, cancelledby } = req.body;
      const order = await Order.findByPk(id, { transaction: t });
      if (!order) {
        await t.rollback();
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      if (order.cancelled) {
        await t.rollback();
        return res.status(400).json({ success: false, message: "Order already cancelled" });
      }

      if (order.orderstatus === "Delivered") {
        await t.rollback();
        return res.status(400).json({ success: false, message: "Delivered orders cannot be cancelled" });
      }

      await order.update(
        {
          cancelled: true,
          cancelreason: cancelreason || null,
          cancelledby: cancelledby || null,
          cancelledat: new Date(),
          orderstatus: "Cancelled",
        },
        { transaction: t }
      );

      await t.commit();
      return res.json({ success: true, data: order });
    } catch (err) {
      await t.rollback();
      console.error("cancelOrder error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Delete order (optional)
  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });
      await order.destroy();
      return res.json({ success: true, message: "Order deleted" });
    } catch (err) {
      console.error("deleteOrder error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },
};