const db = require('../models');
const ReturnPolicy = db.ReturnPolicy;
const ReturnRequest = db.ReturnRequest;

/**
 * GET /api/returns/policy
 * Returns the latest return policy (or default fallback)
 */
exports.getPolicy = async (req, res) => {
  try {
    const policy = await ReturnPolicy.findOne({ order: [['createdAt', 'DESC']] });
    if (!policy) {
      return res.json({
        success: true,
        data: {
          title: 'Return & Refund Policy',
          description: 'Easy returns and hassle-free refunds for your peace of mind',
          eligibilityItems: ['Damaged Items', 'Wrong Item', 'Defective Product'],
          refundProcessSteps: [
            { step: 'Pickup', desc: 'Free pickup from your location' },
            { step: 'Inspection', desc: 'Quality check at our facility' },
            { step: 'Refund', desc: 'Money back to wallet/bank' },
          ],
          nonReturnableTags: ['Groceries', 'Medicines', 'Innerwear', 'Perishables'],
        },
      });
    }

    return res.json({ success: true, data: policy });
  } catch (err) {
    console.error('getPolicy error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * POST /api/returns/request
 * Create a new return request
 * body: { orderId, productId, sellerId, reason, detail, amount }
 */
exports.createRequest = async (req, res) => {
  try {
    const { orderId, productId, sellerId, reason, detail, amount } = req.body;
    if (!orderId || !productId || !sellerId) {
      return res.status(400).json({ success: false, message: 'orderId, productId and sellerId are required' });
    }

    const r = await ReturnRequest.create({
      orderId,
      productId,
      sellerId,
      reason: reason || null,
      detail: detail || null,
      amount: amount || null,
      status: 'pending',
    });

    return res.status(201).json({ success: true, data: r });
  } catch (err) {
    console.error('createRequest error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET /api/returns/recent?sellerId=...&limit=...
 * Returns recent requests for a seller (used to build the Recent Requests table)
 */
exports.recentRequests = async (req, res) => {
  try {
    const { sellerId, limit = 5 } = req.query;
    if (!sellerId) return res.status(400).json({ success: false, message: 'sellerId required' });

    const rows = await ReturnRequest.findAll({
      where: { sellerId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit, 10) || 5,
    });

    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('recentRequests error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * PUT /api/returns/:id/status
 * Update the status of a return request.
 * Body: { status } where status is one of ['pending','pickup_scheduled','inspection','refunded','denied']
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'status required' });

    const allowed = ['pending', 'pickup_scheduled', 'inspection', 'refunded', 'denied'];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'invalid status' });

    const reqRow = await ReturnRequest.findByPk(id);
    if (!reqRow) return res.status(404).json({ success: false, message: 'Return request not found' });

    const prevStatus = reqRow.status;
    reqRow.status = status;
    if (status === 'pickup_scheduled') reqRow.pickupScheduledAt = new Date();
    if (status === 'inspection') reqRow.inspectedAt = new Date();
    if (status === 'refunded') reqRow.refundedAt = new Date();
    await reqRow.save();

    return res.json({ success: true, prevStatus, data: reqRow });
  } catch (err) {
    console.error('updateStatus error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};