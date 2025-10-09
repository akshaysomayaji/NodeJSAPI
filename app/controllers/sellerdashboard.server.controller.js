// sellerDashboard.controller.js

const SellerDashboard = require('../models/sellerDashboard.model');  // adjust path
// If you have models like RecentOrder, TopSelling, Stats, embed/subdocuments, etc.

const createDashboard = async (req, res) => {
  try {
    const data = req.body;
    const dashboard = new SellerDashboard(data);
    await dashboard.save();
    return res.status(201).json(dashboard);
  } catch (err) {
    console.error('Error creating dashboard:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const dashboard = await SellerDashboard.findById(id);
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }
    return res.json(dashboard);
  } catch (err) {
    console.error('Error getting dashboard:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const dashboard = await SellerDashboard.findByIdAndUpdate(id, updates, { new: true });
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }
    return res.json(dashboard);
  } catch (err) {
    console.error('Error updating dashboard:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const dashboard = await SellerDashboard.findByIdAndDelete(id);
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }
    return res.json({ message: 'Dashboard deleted successfully' });
  } catch (err) {
    console.error('Error deleting dashboard:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Increment some statistical counter(s) in the dashboard.
 * For example, viewCount, saleCount, revenue, etc.
 * `statUpdates` is an object: { fieldName: incrementValue, ... }
 */
const incrementStats = async (req, res) => {
  try {
    const { id } = req.params;
    const statUpdates = req.body;  // e.g. { viewCount: 1, saleCount: 2 }
    // Build a $inc update
    const incObj = {};
    for (const key in statUpdates) {
      if (Object.prototype.hasOwnProperty.call(statUpdates, key)) {
        incObj[key] = statUpdates[key];
      }
    }
    const dashboard = await SellerDashboard.findByIdAndUpdate(
      id,
      { $inc: incObj },
      { new: true }
    );
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }
    return res.json(dashboard);
  } catch (err) {
    console.error('Error incrementing stats:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Add an order to recentOrders (assuming dashboard has an array field recentOrders).
 * Optionally limit its size (e.g. max 10).
 */
const addRecentOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = req.body;  // order object to add
    const MAX_RECENT = 10;
    const dashboard = await SellerDashboard.findById(id);
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }
    // Push to front, or push and slice
    dashboard.recentOrders = dashboard.recentOrders || [];
    dashboard.recentOrders.unshift(order);
    // Trim if too many
    if (dashboard.recentOrders.length > MAX_RECENT) {
      dashboard.recentOrders = dashboard.recentOrders.slice(0, MAX_RECENT);
    }
    await dashboard.save();
    return res.json(dashboard);
  } catch (err) {
    console.error('Error adding recent order:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Add a top selling item record into topSelling list.
 * Maybe it has fields like { productId, countSold, lastUpdated, ... }
 * Optionally keep only top N.
 */
const addTopSelling = async (req, res) => {
  try {
    const { id } = req.params;
    const topItem = req.body; // e.g. { productId, soldCount }
    const MAX_TOP = 5;
    const dashboard = await SellerDashboard.findById(id);
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }
    dashboard.topSelling = dashboard.topSelling || [];
    // Check if this product already exists
    const idx = dashboard.topSelling.findIndex(
      (t) => t.productId.toString() === topItem.productId.toString()
    );
    if (idx >= 0) {
      // Update existing
      dashboard.topSelling[idx].soldCount = topItem.soldCount;
      dashboard.topSelling[idx].lastUpdated = new Date();
    } else {
      // Add new
      topItem.lastUpdated = new Date();
      dashboard.topSelling.push(topItem);
    }
    // Sort descending by soldCount
    dashboard.topSelling.sort((a, b) => b.soldCount - a.soldCount);
    // Trim if too many
    if (dashboard.topSelling.length > MAX_TOP) {
      dashboard.topSelling = dashboard.topSelling.slice(0, MAX_TOP);
    }
    await dashboard.save();
    return res.json(dashboard);
  } catch (err) {
    console.error('Error adding top selling item:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createDashboard,
  getDashboard,
  updateDashboard,
  deleteDashboard,
  incrementStats,
  addRecentOrder,
  addTopSelling,
};
