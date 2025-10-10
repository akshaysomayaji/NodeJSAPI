// routes/admindashboard.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admindashboard.controller');

// read dashboard (creates a default one if missing)
router.get('/', ctrl.getDashboard);

// update top-level counts
router.patch('/', ctrl.updateDashboard);

// recent orders - add a recent order (frontend pushes here when orders change)
router.post('/orders', ctrl.addRecentOrder);

// seller verifications - add entry
router.post('/verifications', ctrl.addSellerVerification);

// update verification status
router.patch('/verifications/:sellerId', ctrl.updateSellerVerificationStatus);

// clear lists (optional admin action)
router.post('/clear', ctrl.clearRecent);

module.exports = router;