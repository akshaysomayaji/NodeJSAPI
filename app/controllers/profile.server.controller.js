const db = require('../models'); 
const Profile = db.profile;      


exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findByPk(userId);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.createOrUpdateProfile = async (req, res) => {
  try {
    const payload = req.body;
    
    if (payload.userId) {
      const existing = await Profile.findByPk(payload.userId);
      if (existing) {
        await existing.update(payload);
        return res.json(existing);
      }
    }
    const created = await Profile.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.updateContact = async (req, res) => {
  try {
    const { userId } = req.params;
    const { phone, location } = req.body;
    const profile = await Profile.findByPk(userId);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    
    if (phone !== undefined) profile.phone = phone;
    if (location !== undefined) profile.location = location;

    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getQuickStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findByPk(userId, {
      attributes: ['userId','totalOrders','pendingRequests','favoritesCount']
    });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};