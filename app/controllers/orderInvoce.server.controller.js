
module.exports = (db) => {
  const { Seller, Buyer, Order, OrderItem } = db;

  // helper to build invoice payload with computed summary
  async function buildInvoicePayload(orderInstance) {
    if (!orderInstance) return null;

    // ensure items, seller and buyer are included (if not, fetch them)
    const invoice = await Order.findByPk(orderInstance.orderId, {
      include: [
        { model: Seller, as: 'seller' },
        { model: Buyer, as: 'buyer' },
        { model: OrderItem, as: 'items' }
      ]
    });

    // calculate summary (uses instance method or compute here)
    const summary = await invoice.calculateSummary();

    const payload = invoice.toJSON();
    payload.summary = summary;
    return payload;
  }

  return {
    // Create an invoice (creates seller, buyer, order, items)
    createInvoice: async (req, res) => {
      try {
        const { seller, buyer, order, items } = req.body;
        if (!seller || !buyer || !order || !Array.isArray(items) || items.length === 0) {
          return res.status(400).json({ message: 'Missing seller/buyer/order/items in request body' });
        }

        // create seller & buyer (in real app you may findOrCreate)
        const sellerInstance = await Seller.create(seller);
        const buyerInstance = await Buyer.create(buyer);

        // create order
        const orderInstance = await Order.create({
          ...order,
          sellerId: sellerInstance.sellerId,
          buyerId: buyerInstance.buyerId
        });

        // create items
        const itemInstances = [];
        for (const it of items) {
          const created = await OrderItem.create({
            productName: it.productName,
            productDescription: it.productDescription || null,
            quantity: it.quantity,
            price: it.price,
            total: (it.quantity * it.price) || 0,
            orderId: orderInstance.orderId
          });
          itemInstances.push(created);
        }

        const payload = await buildInvoicePayload(orderInstance);
        return res.status(201).json({ message: 'Invoice created', invoice: payload });
      } catch (err) {
        console.error('createInvoice error:', err);
        return res.status(500).json({ message: 'Server error creating invoice' });
      }
    },

    // List invoices (with seller & buyer basic info)
    listInvoices: async (req, res) => {
      try {
        // optional query params: limit, offset
        const limit = Math.min(100, parseInt(req.query.limit, 10) || 50);
        const offset = parseInt(req.query.offset, 10) || 0;

        const orders = await Order.findAll({
          include: [
            { model: Seller, as: 'seller', attributes: ['sellerId', 'sellerName'] },
            { model: Buyer, as: 'buyer', attributes: ['buyerId', 'buyerName'] }
          ],
          order: [['orderDate', 'DESC']],
          limit,
          offset
        });

        // map to JSON (do not include items here by default)
        const result = orders.map(o => o.toJSON());
        return res.json({ count: result.length, invoices: result });
      } catch (err) {
        console.error('listInvoices error:', err);
        return res.status(500).json({ message: 'Server error fetching invoices' });
      }
    },

    // Get single invoice by orderId
    getInvoiceById: async (req, res) => {
      try {
        const id = req.params.id;
        const orderInstance = await Order.findByPk(id);
        if (!orderInstance) return res.status(404).json({ message: 'Invoice not found' });

        const payload = await buildInvoicePayload(orderInstance);
        return res.json(payload);
      } catch (err) {
        console.error('getInvoiceById error:', err);
        return res.status(500).json({ message: 'Server error fetching invoice' });
      }
    },

    // Mark invoice as printed (set isPrinted true and printedAt)
    markPrinted: async (req, res) => {
      try {
        const id = req.params.id;
        const orderInstance = await Order.findByPk(id);
        if (!orderInstance) return res.status(404).json({ message: 'Invoice not found' });

        orderInstance.isPrinted = true;
        orderInstance.printedAt = new Date();
        await orderInstance.save();

        const payload = await buildInvoicePayload(orderInstance);
        return res.json({ message: 'Invoice marked printed', invoice: payload });
      } catch (err) {
        console.error('markPrinted error:', err);
        return res.status(500).json({ message: 'Server error marking printed' });
      }
    },

    // Optional: update order (status, payment status, shipping, gst, etc.)
    updateInvoice: async (req, res) => {
      try {
        const id = req.params.id;
        const updates = req.body || {};
        const orderInstance = await Order.findByPk(id);
        if (!orderInstance) return res.status(404).json({ message: 'Invoice not found' });

        // only allow certain fields to be updated for safety
        const allowed = ['status', 'shippingCost', 'gstPercent', 'paymentMethod', 'paymentStatus', 'orderDate'];
        for (const key of allowed) {
          if (updates[key] !== undefined) orderInstance[key] = updates[key];
        }
        await orderInstance.save();

        const payload = await buildInvoicePayload(orderInstance);
        return res.json({ message: 'Invoice updated', invoice: payload });
      } catch (err) {
        console.error('updateInvoice error:', err);
        return res.status(500).json({ message: 'Server error updating invoice' });
      }
    }
  };
};