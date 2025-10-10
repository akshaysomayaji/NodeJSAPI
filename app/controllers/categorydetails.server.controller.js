// controllers/categorycreate.controller.js
const db = require("../models");
const CategoryCreate = db.CategoryCreate;

/**
 * Create a new category
 */
exports.createCategory = async (req, res) => {
  try {
    const { categoryname, description, status } = req.body;
    let icon = null;

    // If file upload is handled by multer
    if (req.file) {
      icon = req.file.path; // or req.file.filename, depending on config
    }

    const newCategory = await CategoryCreate.create({
      categoryname,
      description,
      icon,
      status: status !== undefined ? status : true
    });

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory
    });
  } catch (error) {
    console.error("createCategory error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all categories
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryCreate.findAll({
      order: [["createdAt", "DESC"]]
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error("getAllCategories error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single category by ID
 */
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryCreate.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    console.error("getCategoryById error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update category details
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryname, description, status } = req.body;

    const category = await CategoryCreate.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    let icon = category.icon;
    if (req.file) {
      icon = req.file.path;
    }

    await category.update({
      categoryname,
      description,
      icon,
      status: status !== undefined ? status : category.status
    });

    res.status(200).json({
      message: "Category updated successfully",
      category
    });
  } catch (error) {
    console.error("updateCategory error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete category
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryCreate.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("deleteCategory error:", error);
    res.status(500).json({ message: error.message });
  }
};