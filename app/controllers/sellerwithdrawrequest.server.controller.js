// controllers/sellerWithdraw.controller.js
const { Op } = require('sequelize');
const db = require('../models'); // models/index.js must export SellerWithdraw
const SellerWithdraw = db.SellerWithdraw;

/**
 * Create a withdraw request
 * body: { displayid, sellerId, sellerName, contactEmail, contactPhone, amount, currency, adminNotes, createdBy }
 */
async function createWithdraw(req, res) {
  try {
    const payload = req.body || {};
    if (!payload.sellerId || !payload.sellerName || !payload.amount) {
      return res.status(400).json({ message: 'sellerId, sellerName and amount are required' });
    }
    payload.amount = Number(payload.amount) || 0;
    const created = await SellerWithdraw.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    console.error('createWithdraw error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * List withdraws with search/filter/pagination
 * Query params:
 *  - q (search by sellerName, displayid, contactEmail, contactPhone)
 *  - status
 *  - startDate / endDate (ISO)
 *  - page (1-based), limit
 */
async function listWithdraws(req, res) {
  try {
    const q = (req.query.q || '').trim();
    const { status, startDate, endDate } = req.query;
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (startDate || endDate) {
      where.requestDate = {};
      if (startDate) where.requestDate[Op.gte] = new Date(startDate);
      if (endDate) where.requestDate[Op.lte] = new Date(endDate);
    }

    if (q) {
      // iLike for Postgres; for sqlite/MySQL replace with Op.like
      where[Op.or] = [
        { sellerName: { [Op.iLike]: %${q}% } },
        { displayid: { [Op.iLike]: %${q}% } },
        { contactEmail: { [Op.iLike]: %${q}% } },
        { contactPhone: { [Op.iLike]: %${q}% } }
      ];
    }

    const { rows, count } = await SellerWithdraw.findAndCountAll({
      where,
      order: [['requestDate', 'DESC']],
      offset,
      limit
    });

    return res.json({
      items: rows,
      meta: { total: count, page, limit, pages: Math.ceil(count / limit) }
    });
  } catch (err) {
    console.error('listWithdraws error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Get single withdraw by PK
 */
async function getWithdraw(req, res) {
  try {
    const { id } = req.params;
    const rec = await SellerWithdraw.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Withdraw request not found' });
    return res.json(rec);
  } catch (err) {
    console.error('getWithdraw error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Approve a withdraw: set status => Approved and optionally set transactionRef & adminNotes
 * body: { transactionRef, adminNotes }
 */
async function approveWithdraw(req, res) {
  try {
    const { id } = req.params;
    const { transactionRef, adminNotes } = req.body;
    const rec = await SellerWithdraw.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Withdraw request not found' });
    if (rec.status !== 'Pending') return res.status(400).json({ message: 'Only pending requests can be approved' });

    rec.status = 'Approved';
    if (transactionRef) rec.transactionRef = transactionRef;
    if (adminNotes) rec.adminNotes = adminNotes;
    await rec.save();

    return res.json(rec);
  } catch (err) {
    console.error('approveWithdraw error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Deny a withdraw: set status => Denied and store adminNotes
 * body: { adminNotes }
 */
async function denyWithdraw(req, res) {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;
    const rec = await SellerWithdraw.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Withdraw request not found' });
    if (rec.status !== 'Pending') return res.status(400).json({ message: 'Only pending requests can be denied' });

    rec.status = 'Denied';
    if (adminNotes) rec.adminNotes = adminNotes;
    await rec.save();

    return res.json(rec);
  } catch (err) {
    console.error('denyWithdraw error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Mark completed (e.g., after payment executed) -> status = Completed
 * body: { transactionRef, adminNotes }
 */
async function completeWithdraw(req, res) {
  try {
    const { id } = req.params;
    const { transactionRef, adminNotes } = req.body;
    const rec = await SellerWithdraw.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Withdraw request not found' });
    if (rec.status !== 'Approved') return res.status(400).json({ message: 'Only approved requests can be completed' });

    rec.status = 'Completed';
    if (transactionRef) rec.transactionRef = transactionRef;
    if (adminNotes) rec.adminNotes = adminNotes;
    await rec.save();

    return res.json(rec);
  } catch (err) {
    console.error('completeWithdraw error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Delete withdraw (admin)
 */
async function deleteWithdraw(req, res) {
  try {
    const { id } = req.params;
    const rec = await SellerWithdraw.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Withdraw request not found' });

    await rec.destroy();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteWithdraw error:', err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createWithdraw,
  listWithdraws,
  getWithdraw,
  approveWithdraw,
  denyWithdraw,
  completeWithdraw,
  deleteWithdraw
};