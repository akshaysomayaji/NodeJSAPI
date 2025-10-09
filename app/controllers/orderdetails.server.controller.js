const { Op } = require("sequelize");
const { OrderDetail, sequelize } = require("../models"); // adjust path to your models/index.js

// Helper: compute totals from orderitems
function computeTotals(orderitems = [], shippingAmount = 0) {
  let subtotal = 0;
  for (const it of orderitems) {
    const qty = Number(it.qty || it.quantity || 0);
    const price = Number(it.pricePerUnit ?? it.price ?? 0);
    const itemSubtotal = Number(it.subtotal ?? qty * price);
    subtotal += itemSubtotal;
  }
  const total = subtotal + Number(shippingAmount || 0);
  return { subtotal, total };
}

module.exports = {
  // Create order
  createOrder: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const {
        customername,
        mobilenumber,
        emailid,
        deliveryaddress,
        orderitems = [],
        shippingamount = 0,
        paymentstatus,
        orderstatus,
        expecteddeliverydate,
        internalnotes,
        createdby,
        sellerid,
        buyerid,
      } = req.body;

      const { subtotal, total } = computeTotals(orderitems, shippingamount);

      const newOrder = await OrderDetail.create(
        {
          customername,
          mobilenumber,
          emailid,
          deliveryaddress,
          orderitems,
          subtotalamount: subtotal,
          shippingamount: shippingamount,
          totalamount: total,
          paymentstatus: paymentstatus || "Pending",
          orderstatus: orderstatus || "Pending",
          expecteddeliverydate: expecteddeliverydate || null,
          internalnotes: internalnotes || null,
          createdby: createdby || null,
          sellerid: sellerid || null,
          buyerid: buyerid || null,
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

  // Get single order by id
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await OrderDetail.findByPk(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });
      return res.json({ success: true, data: order });
    } catch (err) {
      console.error("getOrderById error:", err);
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
      if (req.query.customername) {
        // Use iLike for Postgres, change to like if using other DBs
        where.customername = { [Op.iLike || Op.like]: %${req.query.customername}% };
      }

      const { rows, count } = await OrderDetail.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return res.json({
        success: true,
        data: rows,
        meta: { total: count, page, limit },
      });
    } catch (err) {
      console.error("listOrders error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Update whole order (items, address, notes, etc.)
  updateOrder: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const order = await OrderDetail.findByPk(id, { transaction: t });
      if (!order) {
        await t.rollback();
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      const updates = { ...req.body };

      // Recalculate totals if items or shipping changed
      if (updates.orderitems || typeof updates.shippingamount !== "undefined") {
        const orderitems = updates.orderitems ?? order.orderitems;
        const shippingamount = typeof updates.shippingamount !== "undefined" ? updates.shippingamount : order.shippingamount;
        const { subtotal, total } = computeTotals(orderitems, shippingamount);
        updates.subtotalamount = subtotal;
        updates.totalamount = total;
      }

      // Keep boolean flags consistent with orderstatus
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

  // Quick status update (orderstatus/paymentstatus/expected delivery)
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { orderstatus, paymentstatus, expecteddeliverydate } = req.body;
      const order = await OrderDetail.findByPk(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });

      const updates = {};
      if (orderstatus) {
        updates.orderstatus = orderstatus;
        updates.isshipped = orderstatus === "Shipped";
        updates.isdelivered = orderstatus === "Delivered";
      }
      if (paymentstatus) updates.paymentstatus = paymentstatus;
      if (typeof expecteddeliverydate !== "undefined") updates.expecteddeliverydate = expecteddeliverydate;

      await order.update(updates);
      return res.json({ success: true, data: order });
    } catch (err) {
      console.error("updateStatus error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Buyer sets a return request flag (simple toggle or with notes)
  setReturnRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const { returnrequest = true } = req.body;
      const order = await OrderDetail.findByPk(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });

      order.returnrequest = Boolean(returnrequest);
      // set returnstatus to Pending when request placed
      if (returnrequest) order.returnstatus = "Pending";
      await order.save();
      return res.json({ success: true, data: order });
    } catch (err) {
      console.error("setReturnRequest error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Admin respond to return request: accept or deny
  respondReturnRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const { action, decisionBy, notes } = req.body;
      if (!["accept", "deny"].includes((action || "").toLowerCase())) {
        return res.status(400).json({ success: false, message: "Invalid action. Use 'accept' or 'deny'." });
      }

      const order = await OrderDetail.findByPk(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });
      if (!order.returnrequest) return res.status(400).json({ success: false, message: "No return request present for this order" });

      const newStatus = action.toLowerCase() === "accept" ? "Accepted" : "Denied";
      order.returnstatus = newStatus;
      order.returndecisionby = decisionBy || null;
      order.returndecisionat = new Date();
      order.returndecisionnotes = notes || null;

      // If accepted, update orderstatus to a return-accepted state
      if (newStatus === "Accepted") {
        order.orderstatus = "ReturnAccepted";
      }

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
      const order = await OrderDetail.findByPk(id, { transaction: t });
      if (!order) {
        await t.rollback();
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      if (order.cancelled) {
        await t.rollback();
        return res.status(400).json({ success: false, message: "Order already cancelled" });
      }

      // Example rule: do not allow cancelling Delivered orders
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
      const order = await OrderDetail.findByPk(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });
      await order.destroy();
      return res.json({ success: true, message: "Order deleted" });
    } catch (err) {
      console.error("deleteOrder error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },
};