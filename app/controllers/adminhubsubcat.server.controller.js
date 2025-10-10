// controllers/subcategory.controller.js
const { Op } = require('sequelize');
const db = require('../models'); // models/index.js must export SubCategory and Category
const SubCategory = db.SubCategory;
const Category = db.Category;

/**
 * Create a subcategory (with optional icon upload)
 * body: { displayid, name, description, parentCategoryId, isActive, sortOrder, createdBy }
 * file: icon (multipart/form-data)
 */
async function createSubCategory(req, res) {
  try {
    const payload = req.body || {};
    const { parentCategoryId, name } = payload;

    if (!name) return res.status(400).json({ message: 'name is required' });
    if (!parentCategoryId) return res.status(400).json({ message: 'parentCategoryId is required' });

    // Verify parent exists
    const parent = await Category.findByPk(parentCategoryId);
    if (!parent) return res.status(400).json({ message: 'Parent category not found' });

    const icon = req.file ? req.file.path : payload.icon;

    const created = await SubCategory.create({
      displayid: payload.displayid || null,
      name,
      description: payload.description || null,
      icon,
      parentCategoryId,
      isActive: payload.isActive !== undefined ? payload.isActive === 'true' || payload.isActive === true : true,
      sortOrder: payload.sortOrder !== undefined ? parseInt(payload.sortOrder, 10) || 0 : 0,
      createdBy: payload.createdBy || null
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error('createSubCategory error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * List subcategories with optional filtering and pagination
 * query: q, parent (parentCategoryId), isActive, page, limit
 */
async function listSubCategories(req, res) {
  try {
    const q = (req.query.q || '').trim();
    const { parent, isActive } = req.query;
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 200);
    const offset = (page - 1) * limit;

    const where = {};
    if (parent) where.parentCategoryId = parent;
    if (isActive !== undefined) where.isActive = String(isActive) === 'true';

    if (q) {
      // iLike for Postgres; replace with Op.like for sqlite/mysql
      where[Op.or] = [
        { name: { [Op.iLike]: %${q}% } },
        { description: { [Op.iLike]: %${q}% } },
        { displayid: { [Op.iLike]: %${q}% } }
      ];
    }

    const { rows, count } = await SubCategory.findAndCountAll({
      where,
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
      offset,
      limit
    });

    return res.json({ items: rows, meta: { total: count, page, limit, pages: Math.ceil(count / limit) } });
  } catch (err) {
    console.error('listSubCategories error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Get single subcategory by PK
 */
async function getSubCategoryById(req, res) {
  try {
    const { id } = req.params;
    const rec = await SubCategory.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Subcategory not found' });
    return res.json(rec);
  } catch (err) {
    console.error('getSubCategoryById error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Update subcategory (partial)
 * Accepts file upload to update icon
 */
async function updateSubCategory(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    const rec = await SubCategory.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Subcategory not found' });

    if (payload.parentCategoryId) {
      const parent = await Category.findByPk(payload.parentCategoryId);
      if (!parent) return res.status(400).json({ message: 'Parent category not found' });
    }

    const icon = req.file ? req.file.path : (payload.icon !== undefined ? payload.icon : rec.icon);

    await rec.update({
      displayid: payload.displayid !== undefined ? payload.displayid : rec.displayid,
      name: payload.name !== undefined ? payload.name : rec.name,
      description: payload.description !== undefined ? payload.description : rec.description,
      icon,
      parentCategoryId: payload.parentCategoryId !== undefined ? payload.parentCategoryId : rec.parentCategoryId,
      isActive: payload.isActive !== undefined ? (payload.isActive === 'true' || payload.isActive === true) : rec.isActive,
      sortOrder: payload.sortOrder !== undefined ? parseInt(payload.sortOrder, 10) || 0 : rec.sortOrder,
      createdBy: payload.createdBy !== undefined ? payload.createdBy : rec.createdBy
    });

    return res.json(rec);
  } catch (err) {
    console.error('updateSubCategory error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Toggle isActive or set explicitly
 */
async function toggleSubCategoryStatus(req, res) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const rec = await SubCategory.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Subcategory not found' });

    if (isActive === undefined) rec.isActive = !rec.isActive;
    else rec.isActive = (isActive === 'true' || isActive === true);

    await rec.save();
    return res.json(rec);
  } catch (err) {
    console.error('toggleSubCategoryStatus error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Delete subcategory
 */
async function deleteSubCategory(req, res) {
  try {
    const { id } = req.params;
    const rec = await SubCategory.findByPk(id);
    if (!rec) return res.status(404).json({ message: 'Subcategory not found' });

    // optional: check if products reference this subcategory before deleting
    await rec.destroy();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteSubCategory error:', err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createSubCategory,
  listSubCategories,
  getSubCategoryById,
  updateSubCategory,
  toggleSubCategoryStatus,
  deleteSubCategory
};