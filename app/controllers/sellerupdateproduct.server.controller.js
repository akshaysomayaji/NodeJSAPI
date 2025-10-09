// controllers/product.controller.js
const { Op } = require("sequelize");
const { ProductDetail, sequelize } = require("../models"); // adjust path if needed

// Helper to compute effective price with discount (if discountprice present and < price)
function computeEffectivePrice(price, discountprice) {
  const p = Number(price || 0);
  const d = typeof discountprice !== "undefined" && discountprice !== null ? Number(discountprice) : null;
  if (d && d > 0 && d < p) return d;
  return p;
}

module.exports = {
  // Create product
  createProduct: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const {
        productname,
        skuid,
        productdescription,
        productimages = [],
        price,
        discountprice = null,
        stockquantity = 0,
        lowstockalert = false,
        lowstockunits = null,
        category,
        subcategory = null,
        brand = null,
        tags = [],
        productstatus = "Active",
      } = req.body;

      if (!productname || !skuid || typeof price === "undefined" || !category) {
        await t.rollback();
        return res.status(400).json({ success: false, message: "productname, skuid, price and category are required" });
      }

      const effectivePrice = computeEffectivePrice(price, discountprice);

      const newProduct = await ProductDetail.create(
        {
          productname,
          skuid,
          productdescription: productdescription || null,
          productimages,
          price: Number(price),
          discountprice: discountprice !== null ? Number(discountprice) : null,
          stockquantity: Number(stockquantity),
          lowstockalert: Boolean(lowstockalert),
          lowstockunits: lowstockunits !== null ? Number(lowstockunits) : null,
          category,
          subcategory,
          brand,
          tags,
          productstatus,
          effectiveprice: effectivePrice, // optional calculated field (see note)
        },
        { transaction: t }
      );

      await t.commit();
      return res.status(201).json({ success: true, data: newProduct });
    } catch (err) {
      await t.rollback();
      console.error("createProduct error:", err);
      // Unique constraint on skuid
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ success: false, message: "SKU already exists" });
      }
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // List products with pagination + filters
  listProducts: async (req, res) => {
    try {
      const page = Math.max(1, Number(req.query.page || 1));
      const limit = Math.min(100, Number(req.query.limit || 20));
      const offset = (page - 1) * limit;

      const where = {};
      if (req.query.category) where.category = req.query.category;
      if (req.query.brand) where.brand = req.query.brand;
      if (req.query.productstatus) where.productstatus = req.query.productstatus;
      if (req.query.search) {
        const q = %${req.query.search}%;
        where[Op.or] = [
          { productname: { [Op.iLike || Op.like]: q } },
          { skuid: { [Op.iLike || Op.like]: q } },
        ];
      }

      const { rows, count } = await ProductDetail.findAndCountAll({
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

  // Get single product by id
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductDetail.findByPk(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });
      return res.json({ success: true, data: product });
    } catch (err) {
      console.error("getProductById error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Update product
  updateProduct: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const product = await ProductDetail.findByPk(id, { transaction: t });
      if (!product) {
        await t.rollback();
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      const updates = { ...req.body };

      // Recompute effective price if price/discount changed
      if (typeof updates.price !== "undefined" || typeof updates.discountprice !== "undefined") {
        const price = typeof updates.price !== "undefined" ? updates.price : product.price;
        const discountprice = typeof updates.discountprice !== "undefined" ? updates.discountprice : product.discountprice;
        updates.effectiveprice = computeEffectivePrice(price, discountprice);
      }

      // ensure correct types
      if (typeof updates.stockquantity !== "undefined") updates.stockquantity = Number(updates.stockquantity);
      if (typeof updates.lowstockunits !== "undefined") updates.lowstockunits = updates.lowstockunits !== null ? Number(updates.lowstockunits) : null;

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

  // Toggle low stock alert or set low stock units
  setLowStock: async (req, res) => {
    try {
      const { id } = req.params;
      const { lowstockalert, lowstockunits } = req.body;
      const product = await ProductDetail.findByPk(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });

      if (typeof lowstockalert !== "undefined") product.lowstockalert = Boolean(lowstockalert);
      if (typeof lowstockunits !== "undefined") product.lowstockunits = lowstockunits !== null ? Number(lowstockunits) : null;

      await product.save();
      return res.json({ success: true, data: product });
    } catch (err) {
      console.error("setLowStock error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Set product status (Active / Inactive)
  setStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { productstatus } = req.body;
      if (!["Active", "Inactive"].includes(productstatus)) {
        return res.status(400).json({ success: false, message: "Invalid productstatus" });
      }
      const product = await ProductDetail.findByPk(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });

      product.productstatus = productstatus;
      await product.save();
      return res.json({ success: true, data: product });
    } catch (err) {
      console.error("setStatus error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Delete product
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductDetail.findByPk(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });
      await product.destroy();
      return res.json({ success: true, message: "Product deleted" });
    } catch (err) {
      console.error("deleteProduct error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },
};