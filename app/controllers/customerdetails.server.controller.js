// controllers/orderdetail.controller.js
const db = require('../models'); // make sure models/index.js exports OrderDetail
const OrderDetail = db.OrderDetail;

async function createOrderDetail(req, res) {
  try {
    const body = req.body;

    // compute total if not provided
    if ((body.totalamount === undefined || body.totalamount === null) && body.unitprice != null && body.quantity != null) {
      const total = parseFloat(body.unitprice) * parseInt(body.quantity, 10);
      body.totalamount = Number(total.toFixed(2));
    }

    const created = await OrderDetail.create(body);
    return res.status(201).json(created);
  } catch (err) {
    console.error('createOrderDetail error:', err);
    return res.status(500).json({ message: err.message });
  }
}

async function getOrderDetailById(req, res) {
  try {
    const { id } = req.params;
    const record = await OrderDetail.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Order not found' });
    return res.json(record);
  } catch (err) {
    console.error('getOrderDetailById error:', err);
    return res.status(500).json({ message: err.message });
  }
}

async function listOrderDetails(req, res) {
  try {
    const where = {};
    // optional filtering by status, mobile, email, etc.
    if (req.query.status) where.status = req.query.status;
    if (req.query.mobilenumber) where.mobilenumber = req.query.mobilenumber;
    if (req.query.emailid) where.emailid = req.query.emailid;

    const items = await OrderDetail.findAll({ where, order: [['createdAt', 'DESC']] });
    return res.json(items);
  } catch (err) {
    console.error('listOrderDetails error:', err);
    return res.status(500).json({ message: err.message });
  }
}

async function updateOrderDetail(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;
    const record = await OrderDetail.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Order not found' });

    // if quantity or unitprice updated, recalc total if not provided
    if ((body.quantity !== undefined || body.unitprice !== undefined) && body.totalamount === undefined) {
      const qty = body.quantity !== undefined ? parseInt(body.quantity, 10) : record.quantity;
      const price = body.unitprice !== undefined ? parseFloat(body.unitprice) : parseFloat(record.unitprice);
      body.totalamount = Number((qty * price).toFixed(2));
    }

    await record.update(body);
    return res.json(record);
  } catch (err) {
    console.error('updateOrderDetail error:', err);
    return res.status(500).json({ message: err.message });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'status is required' });

    const record = await OrderDetail.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Order not found' });

    record.status = status;
    await record.save();
    return res.json(record);
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return res.status(500).json({ message: err.message });
  }
}

async function deleteOrderDetail(req, res) {
  try {
    const { id } = req.params;
    const record = await OrderDetail.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Order not found' });
    await record.destroy();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteOrderDetail error:', err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createOrderDetail,
  getOrderDetailById,
  listOrderDetails,
  updateOrderDetail,
  updateOrderStatus,
  deleteOrderDetail
};