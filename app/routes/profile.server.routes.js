const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile.controller');

router.get('/:userId', controller.getProfile);

router.post('/', controller.createOrUpdateProfile);


router.put('/:userId/contact', controller.updateContact);

router.get('/:userId/stats', controller.getQuickStats);

module.exports = router;