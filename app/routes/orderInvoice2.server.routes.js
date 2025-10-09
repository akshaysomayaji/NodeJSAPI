module.exports = (db) => {
  const router = express.Router();
  const controller = require('../controllers/invoice.controller')(db);

  // POST   /api/invoices          create invoice
  router.post('/', controller.createInvoice);

  // GET    /api/invoices          list invoices
  router.get('/', controller.listInvoices);

  // GET    /api/invoices/:id      get invoice by orderId
  router.get('/:id', controller.getInvoiceById);

  // PUT    /api/invoices/:id      update invoice (partial)
  router.put('/:id', controller.updateInvoice);

  // PUT    /api/invoices/:id/print mark printed
  router.put('/:id/print', controller.markPrinted);

  return router;
};