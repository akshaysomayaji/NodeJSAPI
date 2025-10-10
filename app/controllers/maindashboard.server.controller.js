// controllers/admindashboard.controller.js
const db = require('../models'); // ensure models/index.js exports AdminDashboard
const AdminDashboard = db.AdminDashboard;

/**
 * Get the single dashboard record (create one automatically if not exists)
 */
async function getDashboard(req, res) {
  try {
    let dash = await AdminDashboard.findOne();
    if (!dash) {
      dash = await AdminDashboard.create({});
    }
    return res.json(dash);
  } catch (err) {
    console.error('getDashboard error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Update top-level counts / fields on the dashboard
 * Accepts partial body with any of the numeric summary fields or lastUpdatedBy
 */
async function updateDashboard(req, res) {
  try {
    const payload = req.body || {};
    let dash = await AdminDashboard.findOne();
    if (!dash) dash = await AdminDashboard.create({});

    // allow only known fields to be updated
    const allowed = [
      'totalBuyers','activeBuyers','pendingBuyerVerifications',
      'totalSellers','pendingKYC','activeSellers',
      'totalManufacturers','activeManufacturers','newProductSubmissions',
      'lastUpdatedBy'
    ];
    const updates = {};
    for (const k of allowed) {
      if (payload[k] !== undefined) updates[k] = payload[k];
    }
    await dash.update(updates);
    return res.json(dash);
  } catch (err) {
    console.error('updateDashboard error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Append a recent order (push into recentOrders JSON array)
 * body: { orderId, buyerName, amount, status }
 */
async function addRecentOrder(req, res) {
  try {
    const { orderId, buyerName, amount, status } = req.body || {};
    if (!orderId) return res.status(400).json({ message: 'orderId required' });

    let dash = await AdminDashboard.findOne();
    if (!dash) dash = await AdminDashboard.create({});

    const arr = Array.isArray(dash.recentOrders) ? dash.recentOrders.slice() : [];
    arr.unshift({ orderId, buyerName, amount, status, createdAt: new Date() });
    // keep only latest N (e.g., 10)
    dash.recentOrders = arr.slice(0, 10);
    await dash.save();
    return res.json({ recentOrders: dash.recentOrders });
  } catch (err) {
    console.error('addRecentOrder error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Add a seller verification entry
 * body: { sellerId, sellerName, businessInfo, contact, category, status }
 */
async function addSellerVerification(req, res) {
  try {
    const payload = req.body || {};
    if (!payload.sellerId) return res.status(400).json({ message: 'sellerId required' });

    let dash = await AdminDashboard.findOne();
    if (!dash) dash = await AdminDashboard.create({});

    const arr = Array.isArray(dash.sellerVerifications) ? dash.sellerVerifications.slice() : [];
    arr.unshift({
      sellerId: payload.sellerId,
      sellerName: payload.sellerName || '',
      businessInfo: payload.businessInfo || '',
      contact: payload.contact || '',
      category: payload.category || '',
      status: payload.status || 'Pending',
      createdAt: new Date()
    });
    dash.sellerVerifications = arr.slice(0, 50); // keep recent 50
    // Optionally update pendingBuyerVerifications / pendingKYC counts if required
    await dash.save();
    return res.json({ sellerVerifications: dash.sellerVerifications });
  } catch (err) {
    console.error('addSellerVerification error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Update a specific seller verification entry status by sellerId
 * body: { status }  // e.g., Approve / Deny / Pending
 */
async function updateSellerVerificationStatus(req, res) {
  try {
    const { sellerId } = req.params;
    const { status } = req.body;
    if (!sellerId || !status) return res.status(400).json({ message: 'sellerId and status required' });

    const dash = await AdminDashboard.findOne();
    if (!dash) return res.status(404).json({ message: 'Dashboard record not found' });

    const arr = Array.isArray(dash.sellerVerifications) ? dash.sellerVerifications.slice() : [];
    const idx = arr.findIndex(x => String(x.sellerId) === String(sellerId));
    if (idx === -1) return res.status(404).json({ message: 'Seller verification entry not found' });

    arr[idx].status = status;
    arr[idx].updatedAt = new Date();
    dash.sellerVerifications = arr;
    await dash.save();
    return res.json({ sellerVerifications: dash.sellerVerifications });
  } catch (err) {
    console.error('updateSellerVerificationStatus error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Reset/clear recent lists (optional)
 */
async function clearRecent(req, res) {
  try {
    const dash = await AdminDashboard.findOne();
    if (!dash) return res.status(404).json({ message: 'Dashboard record not found' });
    dash.recentOrders = [];
    dash.sellerVerifications = [];
    await dash.save();
    return res.json({ message: 'Cleared' });
  } catch (err) {
    console.error('clearRecent error:', err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getDashboard,
  updateDashboard,
  addRecentOrder,
  addSellerVerification,
  updateSellerVerificationStatus,
  clearRecent
};