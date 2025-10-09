const db = require("../models");
const Onboard = db.onboardingPreference;

// create or update preference for a user (if userId provided, upsert)
exports.createOrUpdatePreference = async (req, res) => {
  try {
    const { userId, userType, meta, source, completed = true } = req.body;
    if (!userType || (userType !== "Buyer" && userType !== "Seller")) {
      return res.status(400).json({ message: "userType is required and must be 'Buyer' or 'Seller'." });
    }

    // if userId provided try to update existing row for that user
    if (userId) {
      let existing = await Onboard.findOne({ where: { userId } });
      if (existing) {
        await existing.update({ userType, meta, source, completed });
        return res.json({ message: "Preference updated", data: existing });
      }
    }

    // otherwise create a new record
    const created = await Onboard.create({ userId, userType, meta, source, completed });
    return res.status(201).json({ message: "Preference saved", data: created });
  } catch (err) {
    console.error("createOrUpdatePreference:", err);
    return res.status(500).json({ message: err.message });
  }
};

// get preference by id
exports.getPreferenceById = async (req, res) => {
  try {
    const row = await Onboard.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Not found" });
    return res.json(row);
  } catch (err) {
    console.error("getPreferenceById:", err);
    return res.status(500).json({ message: err.message });
  }
};

// get preference by userId
exports.getPreferenceByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId query param required" });
    const row = await Onboard.findOne({ where: { userId } });
    return res.json(row || {});
  } catch (err) {
    console.error("getPreferenceByUser:", err);
    return res.status(500).json({ message: err.message });
  }
};

// list all preferences (admin)
exports.listPreferences = async (req, res) => {
  try {
    const rows = await Onboard.findAll({ order: [["createdAt", "DESC"]] });
    return res.json(rows);
  } catch (err) {
    console.error("listPreferences:", err);
    return res.status(500).json({ message: err.message });
  }
};