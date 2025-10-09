// routes/seller.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/seller.controller');

// get seller profile
router.get('/:id', controller.getSeller);

// update profile
router.put('/:id', controller.updateSeller);

// upload avatar (simple)
router.post('/:id/avatar', controller.uploadAvatar);

// change password (placeholder)
router.post('/:id/change-password', controller.changePassword);

module.exports = router;