module.exports = (db) => {
  const { Seller, Buyer, Order, OrderItem } = db;

  async function buildInvoicePayload(orderInstance) {
    if (!orderInstance) return null;
    const invoice = await Order.findByPk(orderInstance.orderId, {
      include: [
        { model: Seller, as: 'seller' },
        { model: Buyer, as: 'buyer' },
        { model: OrderItem, as: 'items' }
      ]
    });
    if (!invoice) return null;
    const summary = await invoice.calculateSummary();
    const payload = invoice.toJSON();
    payload.summary = summary;
    return payload;
  }

  return {
    // Create invoice (seller,buyer,order,items)
    createInvoice: async (req, res) => {
      try {
        const { seller, buyer, order, items } = req.body;
        if (!seller || !buyer || !order || !Array.isArray(items)) {
          return res.status(400).json({ message: 'Missing required seller/buyer/order/items' });
        }

        // create or find seller/buyer - here we create new records (you can change to findOrCreate)
        const sellerInst = await Seller.create(seller);
        const buyerInst = await Buyer.create(buyer);

        const orderInst = await Order.create({
          ...order,
          sellerId: sellerInst.sellerId,
          buyerId: buyerInst.buyerId
        });

        for (const it of items) {
          await OrderItem.create({
            productName: it.productName,
            productDescription: it.productDescription || null,
            quantity: it.quantity,
            price: it.price,
            total: (it.quantity * it.price) || 0,
            orderId: orderInst.orderId
          });
        }

        const payload = await buildInvoicePayload(orderInst);
        return res.status(201).json({ message: 'Invoice created', invoice: payload });
      } catch (err) {
        console.error('createInvoice error:', err);
        return res.status(500).json({ message: 'Server error while creating invoice' });
      }
    },

    // List invoices (basic info, no items)
    listInvoices: async (req, res) => {
      try {
        const limit = Math.min(100, Number(req.query.limit) || 50);
        const offset = Number(req.query.offset) || 0;

        const orders = await Order.findAll({
          include: [
            { model: Seller, as: 'seller', attributes: ['sellerId','sellerName'] },
            { model: Buyer, as: 'buyer', attributes: ['buyerId','buyerName'] }
          ],
          order: [['orderDate','DESC']],
          limit, offset
        });

        res.json({ count: orders.length, invoices: orders });
      } catch (err) {
        console.error('listInvoices error:', err);
        res.status(500).json({ message: 'Server error while listing invoices' });
      }
    },

    // Get invoice by id (with computed summary)
    getInvoiceById: async (req, res) => {
      try {
        const id = req.params.id;
        const orderInst = await Order.findByPk(id);
        if (!orderInst) return res.status(404).json({ message: 'Invoice not found' });

        const payload = await buildInvoicePayload(orderInst);
        return res.json(payload);
      } catch (err) {
        console.error('getInvoiceById error:', err);
        res.status(500).json({ message: 'Server error while fetching invoice' });
      }
    },

    // Update invoice (partial fields)
    updateInvoice: async (req, res) => {
      try {
        const id = req.params.id;
        const updates = req.body || {};
        const allowed = ['status','shippingCost','gstPercent','paymentMethod','paymentStatus','orderDate','orderNumber'];
        const orderInst = await Order.findByPk(id);
        if (!orderInst) return res.status(404).json({ message: 'Invoice not found' });

        allowed.forEach(k => { if (updates[k] !== undefined) orderInst[k] = updates[k]; });
        await orderInst.save();

        const payload = await buildInvoicePayload(orderInst);
        return res.json({ message: 'Invoice updated', invoice: payload });
      } catch (err) {
        console.error('updateInvoice error:', err);
        res.status(500).json({ message: 'Server error while updating invoice' });
      }
    },

    // Mark printed
    markPrinted: async (req, res) => {
      try {
        const id = req.params.id;
        const orderInst = await Order.findByPk(id);
        if (!orderInst) return res.status(404).json({ message: 'Invoice not found' });
        orderInst.isPrinted = true;
        orderInst.printedAt = new Date();
        await orderInst.save();
        const payload = await buildInvoicePayload(orderInst);
        return res.json({ message: 'Invoice marked printed', invoice: payload });
      } catch (err) {
        console.error('markPrinted error:', err);
        res.status(500).json({ message: 'Server error while marking printed' });
      }
    }
  };
};