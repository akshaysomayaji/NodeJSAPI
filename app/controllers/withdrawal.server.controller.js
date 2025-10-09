const db = require('../models');
const Withdrawal = db.Withdrawal;
const Seller = db.Seller;
const { Op } = db.Sequelize || require('sequelize');

exports.requestWithdrawal = async (req, res) => {
  try {
    const { sellerId, amount, method, note } = req.body;
    const amt = parseFloat(amount || 0);

    if (!sellerId) return res.status(400).json({ success:false, message: 'sellerId required' });
    if (!amt || isNaN(amt) || amt <= 0) return res.status(400).json({ success:false, message: 'Invalid amount' });

    const MIN_WITHDRAWAL = 500.0;
    if (amt < MIN_WITHDRAWAL) return res.status(400).json({ success:false, message: Minimum withdrawal ₹${MIN_WITHDRAWAL} });

    const seller = await Seller.findByPk(sellerId);
    if (!seller) return res.status(404).json({ success:false, message: 'Seller not found' });

    const balance = parseFloat(seller.availableBalance || 0);
    if (amt > balance) return res.status(400).json({ success:false, message: 'Insufficient balance' });

    // Basic transaction using Sequelize transaction to avoid race condition
    const result = await db.sequelize.transaction(async (t) => {
      const w = await Withdrawal.create({
        sellerId,
        amount: amt,
        currency: seller.currency,
        method,
        note,
        status: 'pending'
      }, { transaction: t });

      // deduct
      seller.availableBalance = (balance - amt).toFixed(2);
      await seller.save({ transaction: t });

      return w;
    });

    return res.status(201).json({ success:true, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success:false, message: 'Server error' });
  }
};

exports.recentRequests = async (req, res) => {
  try {
    const { sellerId, limit = 5 } = req.query;
    if (!sellerId) return res.status(400).json({ success:false, message: 'sellerId required' });

    const rows = await Withdrawal.findAll({
      where: { sellerId },
      order: [['createdAt','DESC']],
      limit: parseInt(limit,10) || 5
    });

    return res.json({ success:true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success:false, message: 'Server error' });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const { sellerId } = req.params;
    if (!sellerId) return res.status(400).json({ success:false, message: 'sellerId required' });

    const seller = await Seller.findByPk(sellerId);
    if (!seller) return res.status(404).json({ success:false, message: 'Seller not found' });

    return res.json({ success:true, data: { availableBalance: seller.availableBalance, currency: seller.currency } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success:false, message: 'Server error' });
  }
};

// Admin: change status - approve/deny (refund on denied)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['approved','denied','pending'].includes(status)) return res.status(400).json({ success:false, message: 'invalid status' });

    const w = await Withdrawal.findByPk(id);
    if (!w) return res.status(404).json({ success:false, message: 'withdrawal not found' });

    const prev = w.status;
    w.status = status;
    await w.save();

    // refund if was pending and now denied
    if (prev === 'pending' && status === 'denied') {
      const seller = await Seller.findByPk(w.sellerId);
      if (seller) {
        seller.availableBalance = (parseFloat(seller.availableBalance || 0) + parseFloat(w.amount)).toFixed(2);
        await seller.save();
      }
    }

    return res.json({ success:true, data: w });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success:false, message: 'Server error' });
  }
};