 //controllers/manufacturer.controller.js
const { Op } = require('sequelize');
const db = require('../models'); // models/index.js must export Manufacturer
const Manufacturer = db.Manufacturer;

/**
 * Create a manufacturer record
 */
async function createManufacturer(req, res) {
  try {
    const payload = req.body || {};

    // Basic normalization
    if (payload.productcount !== undefined) payload.productcount = parseInt(payload.productcount, 10) || 0;

    const created = await Manufacturer.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    console.error('createManufacturer error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Get single manufacturer by id (PK)
 */
async function getManufacturerById(req, res) {
  try {
    const { id } = req.params;
    const rec = await Manufacturer.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Manufacturer not found' });
    return res.json(rec);
  } catch (err) {
    console.error('getManufacturerById error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * List manufacturers with optional search, filter and pagination
 * Query params:
 *  - q (search by companyname, contactname, contactemail, contactphone)
 *  - category
 *  - status
 *  - page (1-based)
 *  - limit (per-page, default 10)
 */
async function listManufacturers(req, res) {
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
      where[Op.or] = [
        { companyname: { [Op.iLike]: %${q}% } },   // iLike works in Postgres; for sqlite this falls back
        { contactname: { [Op.iLike]: %${q}% } },
        { contactemail: { [Op.iLike]: %${q}% } },
        { contactphone: { [Op.iLike]: %${q}% } },
        { displayid: { [Op.iLike]: %${q}% } }
      ];
    }

    const { rows, count } = await Manufacturer.findAndCountAll({
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
    console.error('listManufacturers error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Update manufacturer (partial update allowed)
 */
async function updateManufacturer(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const rec = await Manufacturer.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Manufacturer not found' });

    if (body.productcount !== undefined) body.productcount = parseInt(body.productcount, 10) || 0;

    await rec.update(body);
    return res.json(rec);
  } catch (err) {
    console.error('updateManufacturer error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Update only status (badge) or stock-related fields
 */
async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'status is required' });

    const rec = await Manufacturer.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Manufacturer not found' });

    rec.status = status;
    await rec.save();
    return res.json(rec);
  } catch (err) {
    console.error('updateStatus error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Delete manufacturer
 */
async function deleteManufacturer(req, res) {
  try {
    const { id } = req.params;
    const rec = await Manufacturer.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Manufacturer not found' });
    await rec.destroy();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteManufacturer error:', err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createManufacturer,
  getManufacturerById,
  listManufacturers,
  updateManufacturer,
  updateStatus,
  deleteManufacturer
};