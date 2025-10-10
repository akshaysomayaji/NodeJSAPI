// controllers/buyer.actions.controller.js
const db = require('../models'); // models/index.js must export Buyer
const Buyer = db.Buyer;

/**
 * Get buyer profile by id
 */
async function getBuyerProfile(req, res) {
  try {
    const { id } = req.params;
    const buyer = await Buyer.findByPk(id);
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });
    return res.json(buyer);
  } catch (err) {
    console.error('getBuyerProfile error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Approve verification
 * body: { notes } optional
 * Sets isVerified = true, stores verificationNotes, status remains Active
 */
async function approveVerification(req, res) {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const buyer = await Buyer.findByPk(id);
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

    buyer.isVerified = true;
    if (notes) buyer.verificationNotes = notes;
    // If suspended previously, keep suspended flag as is (do not auto-unsuspend)
    await buyer.save();

    return res.json({ message: 'Verification approved', buyer });
  } catch (err) {
    console.error('approveVerification error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Deny verification
 * body: { notes } optional
 * Sets isVerified = false and stores verificationNotes; may keep status Active/Inactive as admin wants
 */
async function denyVerification(req, res) {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const buyer = await Buyer.findByPk(id);
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

    buyer.isVerified = false;
    if (notes) buyer.verificationNotes = notes;
    await buyer.save();

    return res.json({ message: 'Verification denied', buyer });
  } catch (err) {
    console.error('denyVerification error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Toggle suspend / unsuspend
 * body: { reason } optional
 * Flips isSuspended boolean. Also optionally write adminNotes.
 */
async function toggleSuspend(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const buyer = await Buyer.findByPk(id);
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

    buyer.isSuspended = !buyer.isSuspended;
    if (reason) {
      const prefix = `${new Date().toISOString()} - ${buyer.isSuspended ? 'Suspended' : 'Unsuspended'}: `;
      buyer.adminNotes = (buyer.adminNotes ? buyer.adminNotes + '\n' : '') + prefix + reason;
    }
    await buyer.save();

    return res.json({ message: buyer.isSuspended ? 'Buyer suspended' : 'Buyer unsuspended', buyer });
  } catch (err) {
    console.error('toggleSuspend error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Approve payment (payout)
 * body: { paymentRef, notes }
 * Sets paymentApproved = true and stores paymentRef and optionally adminNotes.
 */
async function approvePayment(req, res) {
  try {
    const { id } = req.params;
    const { paymentRef, notes } = req.body;
    const buyer = await Buyer.findByPk(id);
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

    buyer.paymentApproved = true;
    if (paymentRef) buyer.paymentRef = paymentRef;
    if (notes) {
      buyer.adminNotes = (buyer.adminNotes ? buyer.adminNotes + '\n' : '') + ${new Date().toISOString()} - Payment approved: ${notes};
    }
    await buyer.save();

    return res.json({ message: 'Payment approved', buyer });
  } catch (err) {
    console.error('approvePayment error:', err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getBuyerProfile,
  approveVerification,
  denyVerification,
  toggleSuspend,
  approvePayment
};