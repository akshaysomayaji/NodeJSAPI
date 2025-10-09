// controllers/home.controller.js
const db = require("../models");
const Home = db.homeDetails; // model exported as "homeDetails"
const { Op } = require("sequelize");

// --- Banner (single or latest) ---
exports.getBanner = async (req, res) => {
  try {
    // return latest banner entry (sectionType = "Banner")
    const banner = await Home.findOne({
      where: { sectionType: "Banner", status: "Active" },
      order: [["updatedAt", "DESC"]]
    });
    return res.json(banner || {});
  } catch (err) {
    console.error("getBanner:", err);
    return res.status(500).json({ message: err.message });
  }
};

// --- Categories (all active categories, ordered) ---
exports.getCategories = async (req, res) => {
  try {
    const categories = await Home.findAll({
      where: { sectionType: "Category", status: "Active" },
      order: [["displayOrder", "ASC"]], // if you add displayOrder to model later
      attributes: [
        "id",
        "categoryName",
        "categoryIcon",
        "sectionType",
        "status",
        "createdAt",
        "updatedAt"
      ]
    });
    return res.json(categories);
  } catch (err) {
    console.error("getCategories:", err);
    return res.status(500).json({ message: err.message });
  }
};

// --- Recommended Suppliers (paged, optional search) ---
exports.getSuppliers = async (req, res) => {
  try {
    const { q, limit = 5, page = 1 } = req.query;
    const where = { sectionType: "Supplier", status: "Active" };

    if (q) {
      where[Op.or] = [
        { supplierName: { [Op.iLike]: %${q}% } },
        { supplierType: { [Op.iLike]: %${q}% } },
        { supplierDescription: { [Op.iLike]: %${q}% } }
      ];
    }

    const parsedLimit = Math.min(parseInt(limit, 10) || 5, 50);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * parsedLimit;

    const { rows, count } = await Home.findAndCountAll({
      where,
      limit: parsedLimit,
      offset,
      order: [["updatedAt", "DESC"]],
      attributes: [
        "id",
        "supplierName",
        "supplierType",
        "supplierDescription",
        "supplierRating",
        "supplierActionText",
        "status"
      ]
    });

    return res.json({
      data: rows,
      meta: { total: count, page: parseInt(page, 10), limit: parsedLimit }
    });
  } catch (err) {
    console.error("getSuppliers:", err);
    return res.status(500).json({ message: err.message });
  }
};

// --- People are Requesting (list) ---
exports.getRequests = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const requests = await Home.findAll({
      where: { sectionType: "Request", status: "Active" },
      limit: Math.min(parseInt(limit, 10) || 10, 100),
      order: [["updatedAt", "DESC"]],
      attributes: ["id", "requestItem", "supplierCount", "requestStatus", "createdAt"]
    });
    return res.json(requests);
  } catch (err) {
    console.error("getRequests:", err);
    return res.status(500).json({ message: err.message });
  }
};

// --- Admin helpers: create, update, delete entries ---
exports.createEntry = async (req, res) => {
  try {
    const created = await Home.create(req.body);
    return res.status(201).json(created);
  } catch (err) {
    console.error("createEntry:", err);
    return res.status(500).json({ message: err.message });
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const entry = await Home.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    await entry.update(req.body);
    return res.json(entry);
  } catch (err) {
    console.error("updateEntry:", err);
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    const entry = await Home.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    await entry.destroy();
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteEntry:", err);
    return res.status(500).json({ message: err.message });
  }
};