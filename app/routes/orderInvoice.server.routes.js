const express = require('express');

module.exports = (db) => {
  const router = express.Router();
  const controller = require('../controllers/invoice.controller')(db);

  // Create invoice
  // POST /api/invoices
  router.post('/', controller.createInvoice);

  // List invoices
  // GET /api/invoices?limit=20&offset=0
  router.get('/', controller.listInvoices);

  // Get one invoice
  // GET /api/invoices/:id
  router.get('/:id', controller.getInvoiceById);

  // Update invoice (partial)
  // PUT /api/invoices/:id
  router.put('/:id', controller.updateInvoice);

  // Mark printed
  // PUT /api/invoices/:id/print
  router.put('/:id/print', controller.markPrinted);

  return router;
};