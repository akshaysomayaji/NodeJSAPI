const db = require('../models'); 
const FilterPreference = db.FilterPreference;

function getUserIdFromReq(req) {
  if (req.user && req.user.id) return req.user.id;
  
  return req.header('x-user-id') || null;
}

exports.getFilter = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(400).json({ error: 'Missing user id' });

    const pref = await FilterPreference.findOne({ where: { userId } });
    if (!pref) {
      
      return res.json({
        category: null,
        priceMin: 0,
        priceMax: 0,
        minOrderQty: 0,
        supplierTypes: [],
        country: null,
        state: null,
        city: null,
        ratingMin: 0
      });
    }

    return res.json(pref);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.saveFilter = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(400).json({ error: 'Missing user id' });

    
    const {
      category,
      priceMin,
      priceMax,
      minOrderQty,
      supplierTypes, 
      country,
      state,
      city,
      ratingMin
    } = req.body;

    const cleanSupplierTypes = Array.isArray(supplierTypes) ? supplierTypes : [];
    const data = {
      category: category || null,
      priceMin: Number.isFinite(Number(priceMin)) ? Number(priceMin) : 0,
      priceMax: Number.isFinite(Number(priceMax)) ? Number(priceMax) : 0,
      minOrderQty: Number.isFinite(Number(minOrderQty)) ? Number(minOrderQty) : 0,
      supplierTypes: cleanSupplierTypes,
      country: country || null,
      state: state || null,
      city: city || null,
      ratingMin: Number.isFinite(Number(ratingMin)) ? Number(ratingMin) : 0,
      updatedAt: new Date()
    };

    // upsert-style: find or create, then update if exists
    const [pref, created] = await FilterPreference.findOrCreate({
      where: { userId },
      defaults: { userId, ...data }
    });

    if (!created) {
      // update fields
      Object.assign(pref, data);
      await pref.save();
    }

    return res.json(pref);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.resetFilter = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(400).json({ error: 'Missing user id' });

    const defaults = {
      category: null,
      priceMin: 0,
      priceMax: 0,
      minOrderQty: 0,
      supplierTypes: [],
      country: null,
      state: null,
      city: null,
      ratingMin: 0,
      updatedAt: new Date()
    };

    const [pref, created] = await FilterPreference.findOrCreate({
      where: { userId },
      defaults: { userId, ...defaults }
    });

    if (!created) {
      Object.assign(pref, defaults);
      await pref.save();
    }

    return res.json(pref);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};