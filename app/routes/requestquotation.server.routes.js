const express = require('express');
const router = express.Router();
const controller = require('../controllers/quote.controller');

router.post('/', controller.createQuote);

router.get('/', controller.listQuotes);

router.get('/:requestId', controller.getQuoteById);

router.post('/:requestId/respond', controller.respondToQuote);

module.exports = router;