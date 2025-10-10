// controllers/manufacture.controller.js
const db = require('../models'); // ensure models/index.js exports ManufactureDetail
const ManufactureDetail = db.ManufactureDetail;

/**
 * Create a manufacturer + product entry (single-record model)
 * Body may include manufacturer fields + product fields (productname, category, price, stockstatus, stockquantity)
 */
async function createManufacture(req, res) {
  try {
    const payload = req.body;

    // Basic normalization: ensure price and stockquantity numeric
    if (payload.price !== undefined) payload.price = Number(payload.price) || 0;
    if (payload.stockquantity !== undefined) payload.stockquantity = parseInt(payload.stockquantity, 10) || 0;

    const created = await ManufactureDetail.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    console.error('createManufacture error:', err);
    return res.status(500).json({ message: err.message });
  }
}

async function getManufactureById(req, res) {
  try {
    const { id } = req.params;
    const rec = await ManufactureDetail.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Manufacturer not found' });
    return res.json(rec);
  } catch (err) {
    console.error('getManufactureById error:', err);
    return res.status(500).json({ message: err.message });
  }
}

async function listManufactures(req, res) {
  try {
    const where = {};
    if (req.query.companyname) where.companyname = req.query.companyname;
    if (req.query.category) where.category = req.query.category;
    if (req.query.stockstatus) where.stockstatus = req.query.stockstatus;

    const items = await ManufactureDetail.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    return res.json(items);
  } catch (err) {
    console.error('listManufactures error:', err);
    return res.status(500).json({ message: err.message });
  }
}

async function updateManufacture(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;
    const rec = await ManufactureDetail.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Manufacturer not found' });

    if (body.price !== undefined) body.price = Number(body.price) || 0;
    if (body.stockquantity !== undefined) body.stockquantity = parseInt(body.stockquantity, 10) || 0;

    await rec.update(body);
    return res.json(rec);
  } catch (err) {
    console.error('updateManufacture error:', err);
    return res.status(500).json({ message: err.message });
  }
}

async function updateStockStatus(req, res) {
  try {
    const { id } = req.params;
    const { stockstatus, stockquantity } = req.body;
    if (!stockstatus && stockquantity === undefined) {
      return res.status(400).json({ message: 'stockstatus or stockquantity required' });
    }
    const rec = await ManufactureDetail.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Manufacturer not found' });

    if (stockstatus) rec.stockstatus = stockstatus;
    if (stockquantity !== undefined) rec.stockquantity = parseInt(stockquantity, 10) || 0;
    await rec.save();
    return res.json(rec);
  } catch (err) {
    console.error('updateStockStatus error:', err);
    return res.status(500).json({ message: err.message });
  }
}

async function deleteManufacture(req, res) {
  try {
    const { id } = req.params;
    const rec = await ManufactureDetail.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Manufacturer not found' });
    await rec.destroy();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteManufacture error:', err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createManufacture,
  getManufactureById,
  listManufactures,
  updateManufacture,
  updateStockStatus,
  deleteManufacture
};