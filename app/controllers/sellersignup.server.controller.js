const { SellerProfile, sequelize } = require("../models"); // adjust path if needed

module.exports = {
  // Create a new seller profile
  createProfile: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const {
        storename,
        storelogo,
        businesscategory,
        location,
        countrycode = "+1",
        phonenumber,
        emailid,
        sellertype = "Seller",
        createdby,
        notes,
      } = req.body;

      if (!storename) {
        await t.rollback();
        return res.status(400).json({ success: false, message: "storename is required" });
      }

      const profile = await SellerProfile.create({
        storename,
        storelogo: storelogo || null,
        businesscategory: businesscategory || null,
        location: location || null,
        countrycode,
        phonenumber: phonenumber || null,
        emailid: emailid || null,
        sellertype,
        createdby: createdby || null,
        notes: notes || null,
      }, { transaction: t });

      await t.commit();
      return res.status(201).json({ success: true, data: profile });
    } catch (err) {
      await t.rollback();
      console.error("createProfile error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Get a profile by id
  getProfileById: async (req, res) => {
    try {
      const { id } = req.params;
      const profile = await SellerProfile.findByPk(id);
      if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
      return res.json({ success: true, data: profile });
    } catch (err) {
      console.error("getProfileById error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Find profile by email or name (simple search)
  findProfiles: async (req, res) => {
    try {
      const where = {};
      if (req.query.emailid) where.emailid = req.query.emailid;
      if (req.query.storename) where.storename = req.query.storename;
      const rows = await SellerProfile.findAll({ where, order: [["createdAt", "DESC"]] });
      return res.json({ success: true, data: rows });
    } catch (err) {
      console.error("findProfiles error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Update full profile (PUT)
  updateProfile: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const profile = await SellerProfile.findByPk(id, { transaction: t });
      if (!profile) {
        await t.rollback();
        return res.status(404).json({ success: false, message: "Profile not found" });
      }

      const updates = { ...req.body };
      await profile.update(updates, { transaction: t });
      await t.commit();
      return res.json({ success: true, data: profile });
    } catch (err) {
      await t.rollback();
      console.error("updateProfile error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Partial update: upload logo (expects a URL or path in body) or toggle verification
  patchProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const { storelogo, isverified, verificationstep } = req.body;
      const profile = await SellerProfile.findByPk(id);
      if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

      if (typeof storelogo !== "undefined") profile.storelogo = storelogo;
      if (typeof isverified !== "undefined") profile.isverified = Boolean(isverified);
      if (typeof verificationstep !== "undefined") profile.verificationstep = verificationstep;

      await profile.save();
      return res.json({ success: true, data: profile });
    } catch (err) {
      console.error("patchProfile error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Delete profile (optional)
  deleteProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const profile = await SellerProfile.findByPk(id);
      if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
      await profile.destroy();
      return res.json({ success: true, message: "Profile deleted" });
    } catch (err) {
      console.error("deleteProfile error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },
};