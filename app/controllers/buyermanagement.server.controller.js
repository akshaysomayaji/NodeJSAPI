// controllers/buyer.controller.js
const { Op } = require('sequelize');
const db = require('../models'); // models/index.js must export Buyer
const Buyer = db.Buyer;

/**
 * Create buyer
 */
async function createBuyer(req, res) {
  try {
    const payload = req.body || {};
    if (payload.totalOrders !== undefined) payload.totalOrders = parseInt(payload.totalOrders, 10) || 0;
    if (payload.registrationDate) payload.registrationDate = new Date(payload.registrationDate);
    if (payload.lastActive) payload.lastActive = new Date(payload.lastActive);

    const created = await Buyer.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    console.error('createBuyer error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Get buyer by PK
 */
async function getBuyerById(req, res) {
  try {
    const { id } = req.params;
    const rec = await Buyer.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Buyer not found' });
    return res.json(rec);
  } catch (err) {
    console.error('getBuyerById error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * List buyers with search / filter / pagination
 * Query params:
 * - q (search fullname, emailid, mobilenumber, displayid)
 * - status
 * - page (1-based)
 * - limit (per-page, default 10)
 */
async function listBuyers(req, res) {
  try {
    const q = (req.query.q || '').trim();
    const { status } = req.query;
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    if (q) {
      // iLike works in Postgres; for sqlite/mysql replace with Op.like
      where[Op.or] = [
        { fullname: { [Op.iLike]: %${q}% } },
        { emailid: { [Op.iLike]: %${q}% } },
        { mobilenumber: { [Op.iLike]: %${q}% } },
        { displayid: { [Op.iLike]: %${q}% } }
      ];
    }

    const { rows, count } = await Buyer.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });

    return res.json({
      items: rows,
      meta: { total: count, page, limit, pages: Math.ceil(count / limit) }
    });
  } catch (err) {
    console.error('listBuyers error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Partial update
 */
async function updateBuyer(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const rec = await Buyer.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Buyer not found' });

    if (body.totalOrders !== undefined) body.totalOrders = parseInt(body.totalOrders, 10) || 0;
    if (body.registrationDate) body.registrationDate = new Date(body.registrationDate);
    if (body.lastActive) body.lastActive = new Date(body.lastActive);

    await rec.update(body);
    return res.json(rec);
  } catch (err) {
    console.error('updateBuyer error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Update status only
 */
async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'status is required' });

    const rec = await Buyer.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Buyer not found' });

    rec.status = status;
    await rec.save();
    return res.json(rec);
  } catch (err) {
    console.error('updateStatus error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Delete buyer
 */
async function deleteBuyer(req, res) {
  try {
    const { id } = req.params;
    const rec = await Buyer.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Buyer not found' });
    await rec.destroy();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteBuyer error:', err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createBuyer,
  getBuyerById,
  listBuyers,
  updateBuyer,
  updateStatus,
  deleteBuyer
};