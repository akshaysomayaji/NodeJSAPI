module.exports = (db) => {
  const Order = db.OrderDetails;

  return {
    // Create new order
    createOrder: async (req, res) => {
      try {
        const { orderNumber, productName, orderDate, quantity, price, orderStatus, productImage } = req.body;
        const order = await Order.create({
          orderNumber,
          productName,
          orderDate,
          quantity,
          price,
          orderStatus,
          productImage,
        });
        return res.status(201).json(order);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating order" });
      }
    },

    // Get all orders
    getAllOrders: async (req, res) => {
      try {
        const orders = await Order.findAll({
          order: [["orderDate", "DESC"]],
        });
        res.json(orders);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching orders" });
      }
    },

    // Get single order by ID
    getOrderById: async (req, res) => {
      try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching order" });
      }
    },

    // Update order status (e.g. return request → approved)
    updateOrderStatus: async (req, res) => {
      try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.orderStatus = status;
        await order.save();

        res.json({ message: "Order status updated", order });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating order" });
      }
    },

    // Delete an order (optional)
    deleteOrder: async (req, res) => {
      try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        await order.destroy();
        res.json({ message: "Order deleted" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting order" });
      }
    },
  };
};