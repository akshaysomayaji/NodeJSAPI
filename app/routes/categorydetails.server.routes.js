// routes/categorycreate.routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const ctrl = require("../controllers/categorycreate.controller");

// Configure multer for icon uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/icons/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Create category
router.post("/", upload.single("icon"), ctrl.createCategory);

// Get all categories
router.get("/", ctrl.getAllCategories);

// Get single category
router.get("/:id", ctrl.getCategoryById);

// Update category
router.patch("/:id", upload.single("icon"), ctrl.updateCategory);

// Delete category
router.delete("/:id", ctrl.deleteCategory);

module.exports = router;