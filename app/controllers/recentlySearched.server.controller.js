const db = require("../models");
const Product = db.productdetails;
const { Op } = require("sequelize");

// Create a product
exports.createProduct = async (req, res) => {
  try {
    const body = req.body;
    const created = await Product.create(body);
    return res.status(201).json(created);
  } catch (err) {
    console.error("createProduct:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Get product by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (err) {
    console.error("getProductById:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Get all products with optional search, filters, pagination and sorting
exports.getAllProducts = async (req, res) => {
  try {
    const {
      q,               // search term for name/description/manufacturerName
      category,        // filter by category
      minPrice,        // minimum price
      maxPrice,        // maximum price
      verified,        // true/false
      page = 1,
      limit = 20,
      sortBy = "createdAt", // price, price:asc, price:desc, popularityScore
      order = "DESC"
    } = req.query;

    const where = {};

    if (q) {
      where[Op.or] = [
        { productName: { [Op.iLike]: %${q}% } },
        { productDescription: { [Op.iLike]: %${q}% } },
        { manufacturerName: { [Op.iLike]: %${q}% } }
      ];
    }

    if (category) where.category = category;
    if (verified !== undefined) where.verified = verified === "true";
    if (minPrice) where.price = { ...(where.price || {}), [Op.gte]: parseInt(minPrice, 10) };
    if (maxPrice) where.price = { ...(where.price || {}), [Op.lte]: parseInt(maxPrice, 10) };

    // parse paging
    const parsedLimit = Math.min(parseInt(limit, 10) || 20, 100);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * parsedLimit;

    // handle price sort shorthand like "price:asc"
    let orderArray = [[sortBy, order.toUpperCase()]];
    if (sortBy.includes(":")) {
      const [col, dir] = sortBy.split(":");
      orderArray = [[col, dir.toUpperCase()]];
    } else if (sortBy === "price") {
      orderArray = [["price", order.toUpperCase()]];
    }

    const { rows, count } = await Product.findAndCountAll({
      where,
      limit: parsedLimit,
      offset,
      order: orderArray
    });

    return res.json({
      data: rows,
      meta: { total: count, page: parseInt(page, 10), limit: parsedLimit }
    });
  } catch (err) {
    console.error("getAllProducts:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Trending products (flag trending=true)
exports.getTrendingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;
    const products = await Product.findAll({
      where: { trending: true },
      limit,
      order: [["updatedAt", "DESC"]]
    });
    return res.json(products);
  } catch (err) {
    console.error("getTrendingProducts:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Most popular products (flag popular=true OR ordered by popularityScore)
exports.getMostPopular = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 4;
    // prefer popularityScore if present; also allow popular flag
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { popular: true },
          { popularityScore: { [Op.gte]: 1 } }
        ]
      },
      limit,
      order: [["popularityScore", "DESC"], ["updatedAt", "DESC"]]
    });
    return res.json(products);
  } catch (err) {
    console.error("getMostPopular:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Simple endpoint to toggle trending/popular (admin usage)
exports.updateFlags = async (req, res) => {
  try {
    const { id } = req.params;
    const { trending, popular } = req.body;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (trending !== undefined) product.trending = trending;
    if (popular !== undefined) product.popular = popular;
    await product.save();
    return res.json(product);
  } catch (err) {
    console.error("updateFlags:", err);
    return res.status(500).json({ message: err.message });
  }
};