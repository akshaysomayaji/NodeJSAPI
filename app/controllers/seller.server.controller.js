const db = require('../models');
const Seller = db.Seller;

/**
 * GET /api/sellers/:id
 * Return seller profile by id
 */
exports.getSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findByPk(id, { attributes: { exclude: ['passwordHash'] }});
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });
    return res.json({ success: true, data: seller });
  } catch (err) {
    console.error('getSeller error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * PUT /api/sellers/:id
 * Update seller profile fields (businessName, ownerName, email, phone, etc.)
 */
exports.updateSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    // prevent updating protected fields
    delete payload.passwordHash;
    delete payload.sellerid;

    const [updated] = await Seller.update(payload, { where: { sellerid: id } });
    if (!updated) return res.status(404).json({ success: false, message: 'Seller not found or no changes' });

    const seller = await Seller.findByPk(id, { attributes: { exclude: ['passwordHash'] }});
    return res.json({ success: true, data: seller });
  } catch (err) {
    console.error('updateSeller error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * POST /api/sellers/:id/avatar
 * Basic avatar upload endpoint placeholder (expects { avatarUrl } in body or use multipart)
 */
exports.uploadAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const { avatarUrl } = req.body; // for demo; in production use file upload (multer) and store URL
    if (!avatarUrl) return res.status(400).json({ success: false, message: 'avatarUrl required' });

    const seller = await Seller.findByPk(id);
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });

    seller.avatarUrl = avatarUrl;
    await seller.save();

    return res.json({ success: true, data: { avatarUrl: seller.avatarUrl }});
  } catch (err) {
    console.error('uploadAvatar error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * POST /api/sellers/:id/change-password
 * Simple password update placeholder (expects { newPassword }).
 * In production: validate current password and hash new password.
 */
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ success: false, message: 'newPassword required' });

    const seller = await Seller.findByPk(id);
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });

    // NOTE: hash the password in production (bcrypt)
    seller.passwordHash = newPassword; // placeholder only
    await seller.save();

    return res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    console.error('changePassword error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};