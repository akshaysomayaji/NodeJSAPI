const db = require('../models'); // adjust if your models folder path differs
const SortPreference = db.SortPreference;

const VALID = ['relevance','price_low_high','price_high_low','newest','verified_suppliers'];

/**
 * Helper to get userId — replace with your auth implementation
 * Example: req.user.id  (if you use passport/jwt)
 */
function getUserIdFromReq(req) {
  
  return req.user && req.user.id ? req.user.id : (req.header('x-user-id') || null);
}

exports.getSort = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(400).json({ error: 'Missing user id' });

    const pref = await SortPreference.findOne({ where: { userId } });
    if (!pref) return res.json({ sortBy: 'relevance' });

    return res.json({ sortBy: pref.sortBy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.saveSort = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(400).json({ error: 'Missing user id' });

    const { sortBy } = req.body;
    if (!VALID.includes(sortBy)) return res.status(400).json({ error: 'Invalid sort option' });

    // upsert-like behavior
    const [pref, created] = await SortPreference.findOrCreate({
      where: { userId },
      defaults: { sortBy }
    });

    if (!created) {
      pref.sortBy = sortBy;
      pref.updatedAt = new Date();
      await pref.save();
    }

    return res.json({ sortBy: pref.sortBy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.resetSort = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(400).json({ error: 'Missing user id' });

    const [pref, created] = await SortPreference.findOrCreate({
      where: { userId },
      defaults: { sortBy: 'relevance' }
    });

    if (!created) {
      pref.sortBy = 'relevance';
      pref.updatedAt = new Date();
      await pref.save();
    }

    return res.json({ sortBy: 'relevance' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};