const db = require('../models'); // adjust path to your models/index.js
const { Op, fn, col } = require('sequelize');
const Order = db.Order || db.order; // depending on how you export in models/index

/**
 * POST /api/orders/filter
 * body params:
 *  - paymentStatus: "paid" | "pending" | "failed" (optional)
 *  - category: string (optional)
 *  - startDate: "YYYY-MM-DD" (optional)
 *  - endDate: "YYYY-MM-DD" (optional)
 *  - page: number (optional, default 1)
 *  - limit: number (optional, default 20)
 *  - sort: "createdAt:desc" or "createdAt:asc" (optional)
 */
exports.filterOrders = async (req, res) => {
  try {
    const {
      paymentStatus,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sort = 'createdAt:desc',
    } = req.body || {};

    const where = {};

    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (category) where.category = category;

    if (startDate || endDate) {
      // build createdAt range
      const range = {};
      if (startDate) {
        const s = new Date(startDate);
        s.setHours(0, 0, 0, 0);
        range[Op.gte] = s;
      }
      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23, 59, 59, 999);
        range[Op.lte] = e;
      }
      where.createdAt = range;
    }

    // parse sort
    let order = [['createdAt', 'DESC']];
    if (typeof sort === 'string') {
      const [field, dir] = sort.split(':');
      order = [[field || 'createdAt', dir && dir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.max(1, parseInt(limit, 10) || 20);
    const offset = (pageNum - 1) * pageLimit;

    const { rows, count } = await Order.findAndCountAll({
      where,
      order,
      limit: pageLimit,
      offset,
    });

    return res.json({
      success: true,
      data: rows,
      meta: {
        total: count,
        page: pageNum,
        limit: pageLimit,
        pages: Math.ceil(count / pageLimit),
      },
    });
  } catch (err) {
    console.error('filterOrders error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * (Optional) create order endpoint for testing
 */
exports.createOrder = async (req, res) => {
  try {
    const payload = req.body;
    const order = await Order.create(payload);
    return res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error('createOrder error', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};