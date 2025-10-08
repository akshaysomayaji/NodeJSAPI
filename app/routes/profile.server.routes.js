const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile.controller');

router.get('/:userId', controller.getProfile);

router.post('/', controller.createOrUpdateProfile);


router.put('/:userId/contact', controller.updateContact);

router.get('/:userId/stats', controller.getQuickStats);

module.exports = router;

module.exports = function (app) {
    app.route('/api/profile/get/:userId').get(index.index);
    app.route('/api/profile/update').get(index.index);
};