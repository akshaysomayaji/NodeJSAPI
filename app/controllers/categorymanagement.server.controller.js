// controllers/category.controller.js
const { Op } = require('sequelize');
const db = require('../models'); // models/index.js must export Category
const Category = db.Category;

/**
 * Create a category
 * body: { displayid, name, description, icon, parentCategoryId, isActive, sortOrder, createdBy }
 */
async function createCategory(req, res) {
  try {
    const payload = req.body || {};
    // basic normalization
    if (payload.sortOrder !== undefined) payload.sortOrder = parseInt(payload.sortOrder, 10) || 0;
    const created = await Category.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    console.error('createCategory error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Get category by PK
 */
async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const cat = await Category.findByPk(id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    return res.json(cat);
  } catch (err) {
    console.error('getCategoryById error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * List categories with search/filter/pagination
 * Query:
 *  - q (search name or description or displayid)
 *  - isActive (true/false)
 *  - parent (parentCategoryId)
 *  - page (1-based), limit
 */
async function listCategories(req, res) {
  try {
    const q = (req.query.q || '').trim();
    const { isActive, parent } = req.query;
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (isActive !== undefined) {
      // allow "true" / "false"
      where.isActive = String(isActive) === 'true';
    }
    if (parent) where.parentCategoryId = parent;

    if (q) {
      // iLike for Postgres. If using sqlite/MySQL replace with Op.like
      where[Op.or] = [
        { name: { [Op.iLike]: %${q}% } },
        { description: { [Op.iLike]: %${q}% } },
        { displayid: { [Op.iLike]: %${q}% } }
      ];
    }

    const { rows, count } = await Category.findAndCountAll({
      where,
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
      offset,
      limit
    });

    return res.json({
      items: rows,
      meta: { total: count, page, limit, pages: Math.ceil(count / limit) }
    });
  } catch (err) {
    console.error('listCategories error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Partial update
 */
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const cat = await Category.findByPk(id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    if (body.sortOrder !== undefined) body.sortOrder = parseInt(body.sortOrder, 10) || 0;
    await cat.update(body);
    return res.json(cat);
  } catch (err) {
    console.error('updateCategory error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Toggle status (activate/deactivate)
 * body: { isActive: true/false }  OR uses existing toggle
 */
async function toggleStatus(req, res) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const cat = await Category.findByPk(id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    if (isActive === undefined) {
      cat.isActive = !cat.isActive;
    } else {
      cat.isActive = Boolean(isActive);
    }
    await cat.save();
    return res.json(cat);
  } catch (err) {
    console.error('toggleStatus error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Delete category
 */
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const cat = await Category.findByPk(id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    // Optionally check if children exist and prevent deletion
    const children = await Category.count({ where: { parentCategoryId: id } });
    if (children > 0) {
      return res.status(400).json({ message: 'Category has sub-categories. Delete or reassign them first.' });
    }

    await cat.destroy();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteCategory error:', err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createCategory,
  getCategoryById,
  listCategories,
  updateCategory,
  toggleStatus,
  deleteCategory
}