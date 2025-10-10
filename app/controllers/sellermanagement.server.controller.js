// controllers/seller.controller.js
const { Op } = require('sequelize');
const db = require('../models'); // models/index.js must export Seller
const Seller = db.Seller;

/**
 * Create a seller
 */
async function createSeller(req, res) {
  try {
    const payload = req.body || {};
    if (payload.productcount !== undefined) payload.productcount = parseInt(payload.productcount, 10) || 0;
    if (payload.orderscount !== undefined) payload.orderscount = parseInt(payload.orderscount, 10) || 0;
    if (payload.joinedAt) payload.joinedAt = new Date(payload.joinedAt);

    const created = await Seller.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    console.error('createSeller error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Get one seller by PK
 */
async function getSellerById(req, res) {
  try {
    const { id } = req.params;
    const rec = await Seller.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Seller not found' });
    return res.json(rec);
  } catch (err) {
    console.error('getSellerById error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * List sellers with search / filter / pagination
 * Query params:
 *  - q (search storename, ownername, emailid, mobilenumber, displayid)
 *  - category
 *  - status
 *  - page (1-based, default 1)
 *  - limit (default 10)
 */
async function listSellers(req, res) {
  try {
    const q = (req.query.q || '').trim();
    const { category, status } = req.query;
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (category) where.category = category;
    if (status) where.status = status;

    if (q) {
      // For Postgres use iLike; for sqlite/MySQL replace with Op.like
      where[Op.or] = [
        { storename: { [Op.iLike]: %${q}% } },
        { ownername: { [Op.iLike]: %${q}% } },
        { emailid: { [Op.iLike]: %${q}% } },
        { mobilenumber: { [Op.iLike]: %${q}% } },
        { displayid: { [Op.iLike]: %${q}% } }
      ];
    }

    const { rows, count } = await Seller.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });

    return res.json({
      items: rows,
      meta: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    console.error('listSellers error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Partial update
 */
async function updateSeller(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const rec = await Seller.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Seller not found' });

    if (body.productcount !== undefined) body.productcount = parseInt(body.productcount, 10) || 0;
    if (body.orderscount !== undefined) body.orderscount = parseInt(body.orderscount, 10) || 0;
    if (body.joinedAt) body.joinedAt = new Date(body.joinedAt);

    await rec.update(body);
    return res.json(rec);
  } catch (err) {
    console.error('updateSeller error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Update status or counts only
 */
async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, productcount, orderscount } = req.body;
    if (!status && productcount === undefined && orderscount === undefined) {
      return res.status(400).json({ message: 'status or counts required' });
    }
    const rec = await Seller.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Seller not found' });

    if (status) rec.status = status;
    if (productcount !== undefined) rec.productcount = parseInt(productcount, 10) || 0;
    if (orderscount !== undefined) rec.orderscount = parseInt(orderscount, 10) || 0;
    await rec.save();
    return res.json(rec);
  } catch (err) {
    console.error('updateStatus error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Delete
 */
async function deleteSeller(req, res) {
  try {
    const { id } = req.params;
    const rec = await Seller.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Seller not found' });
    await rec.destroy();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteSeller error:', err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createSeller,
  getSellerById,
  listSellers,
  updateSeller,
  updateStatus,
  deleteSeller
};