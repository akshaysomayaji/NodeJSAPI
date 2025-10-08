const express = require('express');
const router = express.Router();
const sortController = require('../controllers/sort.controller');

const fakeAuth = (req, res, next) => {
  
  if (!req.user) {
    const headerId = req.header('x-user-id');
    if (headerId) req.user = { id: headerId };
  }
  next();
};

router.use(fakeAuth);

router.get('/', sortController.getSort);       
router.post('/', sortController.saveSort);     
router.post('/reset', sortController.resetSort); 
module.exports = router;