const db = require('../models'); // adjust path to your models index
const QuoteRequest = db.quoterequest;

exports.createQuote = async (req, res) => {
  try {
    const { userId, productId, quantity, budgetRange, deliveryLocation, notes, meta } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const payload = {
      userId,
      productId: productId || null,
      quantity: Number(quantity) || 1,
      budgetRange: budgetRange || null,
      deliveryLocation: deliveryLocation || null,
      notes: notes || null,
      meta: meta || null
    };

    const created = await QuoteRequest.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    console.error('createQuote error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
exports.getQuoteById = async (req, res) => {
  try {
    const { requestId } = req.params;
    const record = await QuoteRequest.findByPk(requestId);
    if (!record) return res.status(404).json({ message: 'Quote request not found' });
    return res.json(record);
  } catch (err) {
    console.error('getQuoteById error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.listQuotes = async (req, res) => {
  try {
    const where = {};
    if (req.query.userId) where.userId = req.query.userId;
    if (req.query.status) where.status = req.query.status;

    const list = await QuoteRequest.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    return res.json(list);
  } catch (err) {
    console.error('listQuotes error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.respondToQuote = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { price, eta, message, status } = req.body;

    const record = await QuoteRequest.findByPk(requestId);
    if (!record) return res.status(404).json({ message: 'Quote request not found' });

    record.response = { price: price || null, eta: eta || null, message: message || null };
    if (status) record.status = status;

    await record.save();
    return res.json(record);
  } catch (err) {
    console.error('respondToQuote error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};