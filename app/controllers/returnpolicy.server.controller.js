const db = require('../models'); 
const ReturnPolicy = db.returnpolicy;
const ReturnRequest = db.returnrequest;

 * Get active return policy (single record). If not present, return seedData.
 */
exports.getPolicy = async (req, res) => {
  try {
    let policy = await ReturnPolicy.findOne({ where: { isActive: true }, order: [['createdAt', 'DESC']] });
    if (!policy) {
      
      policy = ReturnPolicy.build(ReturnPolicy.seedData);
    }
    return res.json(policy);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.userId || !payload.orderId || !Array.isArray(payload.items) || payload.items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields: userId, orderId, items' });
    }

    const reqRec = await ReturnRequest.create({
      userId: payload.userId,
      orderId: payload.orderId,
      items: payload.items,
      reason: payload.reason || null,
      pickupAddress: payload.pickupAddress || null,
      meta: payload.meta || null
    });

    return res.status(201).json(reqRec);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.listRequests = async (req, res) => {
  try {
    const where = {};
    if (req.query.userId) where.userId = req.query.userId;
    if (req.query.status) where.status = req.query.status;

    const list = await ReturnRequest.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;
    const r = await ReturnRequest.findByPk(requestId);
    if (!r) return res.status(404).json({ message: 'Request not found' });
    return res.json(r);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};