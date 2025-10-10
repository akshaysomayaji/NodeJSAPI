// routes/subcategory.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ctrl = require('../controllers/subcategory.controller');

// multer storage configuration (icons)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/icons/'); // ensure folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Create
router.post('/', upload.single('icon'), ctrl.createSubCategory);

// List with filters
router.get('/', ctrl.listSubCategories);

// Get one
router.get('/:id', ctrl.getSubCategoryById);

// Update
router.patch('/:id', upload.single('icon'), ctrl.updateSubCategory);

// Toggle status
router.patch('/:id/status', ctrl.toggleSubCategoryStatus);

// Delete
router.delete('/:id', ctrl.deleteSubCategory);

module.exports = router;