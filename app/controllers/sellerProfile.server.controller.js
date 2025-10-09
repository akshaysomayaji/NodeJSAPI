const db = require("../models");
const Seller = db.sellerProfile;

// Create seller profile
exports.createSeller = async (req, res) => {
  try {
    const data = req.body;
    const seller = await Seller.create(data);
    return res.status(201).json({ message: "Seller profile created", seller });
  } catch (err) {
    console.error("createSeller:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Get all sellers (for admin or dashboard)
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.json(sellers);
  } catch (err) {
    console.error("getAllSellers:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Get seller by ID
exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    return res.json(seller);
  } catch (err) {
    console.error("getSellerById:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Update seller details
exports.updateSeller = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    await seller.update(req.body);
    return res.json({ message: "Seller updated successfully", seller });
  } catch (err) {
    console.error("updateSeller:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Delete seller (optional)
exports.deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    await seller.destroy();
    return res.json({ message: "Seller deleted successfully" });
  } catch (err) {
    console.error("deleteSeller:", err);
    return res.status(500).json({ message: err.message });
  }
};