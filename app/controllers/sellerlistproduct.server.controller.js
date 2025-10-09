// controllers/productlist.controller.js
const { Op } = require("sequelize");
const { ProductList, sequelize } = require("../models"); // adjust path if needed

// Derive stock status from quantity
function deriveStockStatus(quantity = 0, lowThreshold = 5) {
  const q = Number(quantity || 0);
  if (q <= 0) return "Out of Stock";
  if (q <= lowThreshold) return "Low Stock";
  return "In Stock";
}

module.exports = {
  // Create product
  createProduct: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const {
        productname,
        skuid,
        price,
        stockquantity = 0,
        productimage = null,
        category = null,
        productstatus = "Active",
        lowThreshold = 5, // optional client-provided threshold
      } = req.body;

      if (!productname || !skuid || typeof price === "undefined") {
        await t.rollback();
        return res.status(400).json({ success: false, message: "productname, skuid and price are required" });
      }

      const stockstatus = deriveStockStatus(stockquantity, lowThreshold);

      const newProduct = await ProductList.create(
        {
          productname,
          skuid,
          price: Number(price),
          stockquantity: Number(stockquantity),
          stockstatus,
          productimage,
          category,
          productstatus,
        },
        { transaction: t }
      );

      await t.commit();
      return res.status(201).json({ success: true, data: newProduct });
    } catch (err) {
      await t.rollback();
      console.error("createProduct error:", err);
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ success: false, message: "SKU already exists" });
      }
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // List products with pagination + search + filters
  listProducts: async (req, res) => {
    try {
      const page = Math.max(1, Number(req.query.page || 1));
      const limit = Math.min(100, Number(req.query.limit || 20));
      const offset = (page - 1) * limit;

      const where = {};
      if (req.query.category) where.category = req.query.category;
      if (req.query.productstatus) where.productstatus = req.query.productstatus;
      if (req.query.stockstatus) where.stockstatus = req.query.stockstatus;

      if (req.query.q) {
        const q = %${req.query.q}%;
        const ilike = Op.iLike || Op.like;
        where[Op.or] = [
          { productname: { [ilike]: q } },
          { skuid: { [ilike]: q } },
        ];
      }

      const { rows, count } = await ProductList.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return res.json({ success: true, data: rows, meta: { total: count, page, limit } });
    } catch (err) {
      console.error("listProducts error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Get single product
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductList.findByPk(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });
      return res.json({ success: true, data: product });
    } catch (err) {
      console.error("getProductById error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Update product (recompute stockstatus if stockquantity provided)
  updateProduct: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const product = await ProductList.findByPk(id, { transaction: t });
      if (!product) {
        await t.rollback();
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      const updates = { ...req.body };

      // If stockquantity changed, recompute stockstatus (optional lowThreshold)
      if (typeof updates.stockquantity !== "undefined") {
        const lowThreshold = typeof updates.lowThreshold !== "undefined" ? Number(updates.lowThreshold) : 5;
        updates.stockstatus = deriveStockStatus(updates.stockquantity, lowThreshold);
        updates.stockquantity = Number(updates.stockquantity);
      }

      // Ensure numeric price if provided
      if (typeof updates.price !== "undefined") updates.price = Number(updates.price);

      await product.update(updates, { transaction: t });
      await t.commit();
      return res.json({ success: true, data: product });
    } catch (err) {
      await t.rollback();
      console.error("updateProduct error:", err);
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ success: false, message: "SKU already exists" });
      }
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Toggle product status (Active / Inactive)
  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductList.findByPk(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });

      product.productstatus = product.productstatus === "Active" ? "Inactive" : "Active";
      await product.save();
      return res.json({ success: true, data: product });
    } catch (err) {
      console.error("toggleStatus error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Set stock status manually (or use auto=false to force)
  setStockStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { stockstatus } = req.body;
      if (!["In Stock", "Low Stock", "Out of Stock"].includes(stockstatus)) {
        return res.status(400).json({ success: false, message: "Invalid stockstatus" });
      }
      const product = await ProductList.findByPk(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });

      product.stockstatus = stockstatus;
      await product.save();
      return res.json({ success: true, data: product });
    } catch (err) {
      console.error("setStockStatus error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Delete product
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductList.findByPk(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });
      await product.destroy();
      return res.json({ success: true, message: "Product deleted" });
    } catch (err) {
      console.error("deleteProduct error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },
};