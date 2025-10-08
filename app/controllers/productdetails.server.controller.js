const db = require('../models'); // adjust path
const Product = db.product;
const ProductImage = db.productimage;

/**
 * Get product details by productId.
 * Includes images and basic related lists (new arrivals, popular, best sellers).
 */
exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByPk(productId, {
      include: [{ model: ProductImage, as: 'images', attributes: ['url','position','altText'] }]
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // fetch simple related lists by flags (limit to 6)
    const newArrivals = await Product.findAll({ where: { isNewArrival: true, isActive: true }, limit: 6 });
    const mostPopular = await Product.findAll({ where: { isPopular: true, isActive: true }, limit: 6 });
    const bestSellers = await Product.findAll({ where: { isBestSeller: true, isActive: true }, limit: 6 });

    return res.json({
      product,
      related: {
        newArrivals,
        mostPopular,
        bestSellers
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create product (admin)
 */
exports.createProduct = async (req, res) => {
  try {
    const payload = req.body;
    const created = await Product.create(payload);

    // optionally create images
    if (Array.isArray(payload.images) && payload.images.length) {
      const imagesToCreate = payload.images.map((u, i) => ({ productId: created.productId, url: u, position: i }));
      await ProductImage.bulkCreate(imagesToCreate);
    }

    const result = await Product.findByPk(created.productId, { include: [{ model: ProductImage, as: 'images' }] });
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update product (admin)
 */
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const payload = req.body;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.update(payload);

    const updated = await Product.findByPk(productId, { include: [{ model: ProductImage, as: 'images' }] });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Search / list products (pagination)
 */
exports.listProducts = async (req, res) => {
  try {
    const q = req.query.q || null;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '12');
    const offset = (page - 1) * limit;

    const where = { isActive: true };
    if (q) where.name = { [db.Sequelize.Op.iLike || db.Sequelize.Op.like]: %${q}% }; // adapt operator to DB

    const { rows, count } = await Product.findAndCountAll({
      where,
      limit, offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: ProductImage, as: 'images', attributes: ['url'] }]
    });

    return res.json({ items: rows, total: count, page, limit });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};