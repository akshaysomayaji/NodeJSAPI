const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filter.controller');

const fakeAuth = (req, res, next) => {
  if (!req.user) {
    const headerId = req.header('x-user-id');
    if (headerId) req.user = { id: headerId };
  }
  next();
};

router.use(fakeAuth);

router.get('/', filterController.getFilter);        
router.post('/', filterController.saveFilter);      
router.post('/reset', filterController.resetFilter);
module.exports = router;