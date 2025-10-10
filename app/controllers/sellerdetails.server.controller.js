// controllers/sellerDetail.controller.js
const { Op } = require('sequelize');
const db = require('../models'); // models/index.js must export SellerDetail
const SellerDetail = db.SellerDetail;

/**
 * Create a seller row
 */
async function createSeller(req, res) {
  try {
    const payload = req.body || {};
    if (payload.orderscount !== undefined) payload.orderscount = parseInt(payload.orderscount, 10) || 0;
    if (payload.joinedAt) payload.joinedAt = new Date(payload.joinedAt);

    const created = await SellerDetail.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    console.error('createSeller error', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Get one seller by PK
 */
async function getSellerById(req, res) {
  try {
    const { id } = req.params;
    const rec = await SellerDetail.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Seller not found' });
    return res.json(rec);
  } catch (err) {
    console.error('getSellerById error', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * List sellers with search, filters and pagination
 * Query params:
 *  - q (search displayid, sellername, emailid, mobilenumber)
 *  - status
 *  - manufacturecompany
 *  - page (1-based)
 *  - limit (default 10)
 */
async function listSellers(req, res) {
  try {
    const q = (req.query.q || '').trim();
    const { status, manufacturecompany } = req.query;
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (manufacturecompany) where.manufacturecompany = manufacturecompany;

    if (q) {
      // iLike is Postgres-specific; change to Op.like for sqlite/mysql
      where[Op.or] = [
        { displayid: { [Op.iLike]: %${q}% } },
        { sellername: { [Op.iLike]: %${q}% } },
        { emailid: { [Op.iLike]: %${q}% } },
        { mobilenumber: { [Op.iLike]: %${q}% } }
      ];
    }

    const { rows, count } = await SellerDetail.findAndCountAll({
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
    console.error('listSellers error', err);
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
    const rec = await SellerDetail.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Seller not found' });

    if (body.orderscount !== undefined) body.orderscount = parseInt(body.orderscount, 10) || 0;
    if (body.joinedAt) body.joinedAt = new Date(body.joinedAt);

    await rec.update(body);
    return res.json(rec);
  } catch (err) {
    console.error('updateSeller error', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Update only status (badge) or internal notes
 */
async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, internalNotes } = req.body;
    if (!status && internalNotes === undefined) return res.status(400).json({ message: 'status or internalNotes required' });

    const rec = await SellerDetail.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Seller not found' });

    if (status) rec.status = status;
    if (internalNotes !== undefined) rec.internalNotes = internalNotes;
    await rec.save();
    return res.json(rec);
  } catch (err) {
    console.error('updateStatus error', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Quick action: approve verification
 */
async function approveVerification(req, res) {
  try {
    const { id } = req.params;
    const rec = await SellerDetail.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Seller not found' });

    rec.status = 'Verified';
    await rec.save();
    return res.json({ message: 'Seller verified', seller: rec });
  } catch (err) {
    console.error('approveVerification error', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Delete seller
 */
async function deleteSeller(req, res) {
  try {
    const { id } = req.params;
    const rec = await SellerDetail.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Seller not found' });
    await rec.destroy();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteSeller error', err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createSeller,
  getSellerById,
  listSellers,
  updateSeller,
  updateStatus,
  approveVerification,
  deleteSeller
};