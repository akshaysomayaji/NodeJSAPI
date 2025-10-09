
module.exports = (sequelize, Sequelize) => {
  const { UUID, UUIDV4, STRING, TEXT, FLOAT, INTEGER, DATE, BOOLEAN, ENUM, VIRTUAL } = Sequelize;

  // -----------------------
  // Seller
  // -----------------------
  const Seller = sequelize.define(
    "Seller",
    {
      sellerId: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      sellerName: { type: STRING, allowNull: false },
      subtitle: { type: STRING },
      address: { type: TEXT, allowNull: false },
      phone: { type: STRING, allowNull: false },
      email: { type: STRING, allowNull: false },
      gstNumber: { type: STRING },
      panNumber: { type: STRING },
    },
    { tableName: "sellers", timestamps: false }
  );

  // -----------------------
  // Buyer
  // -----------------------
  const Buyer = sequelize.define(
    "Buyer",
    {
      buyerId: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      buyerName: { type: STRING, allowNull: false },
      role: { type: STRING, defaultValue: "Customer" },
      address: { type: TEXT, allowNull: false },
      phone: { type: STRING, allowNull: false },
      email: { type: STRING, allowNull: false },
    },
    { tableName: "buyers", timestamps: false }
  );

  // -----------------------
  // OrderItem
  // -----------------------
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      itemId: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      productName: { type: STRING, allowNull: false },
      productDescription: { type: STRING },
      quantity: { type: INTEGER, allowNull: false, defaultValue: 1 },
      price: { type: FLOAT, allowNull: false }, // single unit price
      // total stored for convenience but can be calculated
      total: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
        set(value) {
          // if user supplies total, accept; otherwise we compute from qty * price
          if (value) this.setDataValue("total", value);
          else this.setDataValue("total", this.quantity * this.price);
        },
      },
    },
    { tableName: "order_items", timestamps: false }
  );

  // -----------------------
  // Order
  // -----------------------
  const Order = sequelize.define(
    "Order",
    {
      orderId: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      orderNumber: { type: STRING, allowNull: false, unique: true },
      orderDate: { type: DATE, allowNull: false },
      status: { type: STRING, allowNull: false, defaultValue: "Delivered" },

      // Financial fields
      shippingCost: { type: FLOAT, allowNull: false, defaultValue: 0 },
      gstPercent: { type: FLOAT, allowNull: false, defaultValue: 18 },

      // Payment
      paymentMethod: {
        type: ENUM("Cash", "UPI", "Card", "NetBanking", "Other"),
        allowNull: false,
        defaultValue: "UPI",
      },
      paymentStatus: {
        type: ENUM("Pending", "Paid", "Failed", "Refunded"),
        allowNull: false,
        defaultValue: "Paid",
      },

      // Print info
      isPrinted: { type: BOOLEAN, allowNull: false, defaultValue: false },
      printedAt: { type: DATE, allowNull: true },

      // Virtual fields (computed from items)
      subtotal: {
        type: VIRTUAL,
        get() {
          // when items are included (order.items), compute subtotal
          const items = this.getDataValue("items") || this.items || [];
          if (!items || items.length === 0) return 0;
          return items.reduce((s, it) => {
            // item might be plain object or sequelize instance
            const qty = Number(it.quantity || it.qty || 0);
            const price = Number(it.price || 0);
            return s + qty * price;
          }, 0);
        },
      },
      gstAmount: {
        type: VIRTUAL,
        get() {
          const sub = this.get("subtotal") || 0;
          const percent = Number(this.getDataValue("gstPercent") || this.gstPercent || 0);
          return Math.round((sub * percent) / 100);
        },
      },
      grandTotal: {
        type: VIRTUAL,
        get() {
          const sub = Number(this.get("subtotal") || 0);
          const gst = Number(this.get("gstAmount") || 0);
          const ship = Number(this.getDataValue("shippingCost") || this.shippingCost || 0);
          return Math.round(sub + gst + ship);
        },
      },
    },
    {
      tableName: "orders",
      timestamps: false,
    }
  );

  // -----------------------
  // Associations
  // -----------------------
  Seller.hasMany(Order, { foreignKey: "sellerId", as: "orders" });
  Buyer.hasMany(Order, { foreignKey: "buyerId", as: "orders" });

  Order.belongsTo(Seller, { foreignKey: "sellerId", as: "seller" });
  Order.belongsTo(Buyer, { foreignKey: "buyerId", as: "buyer" });
  Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });

  OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

  // -----------------------
  // Instance helper: calculateSummary()
  // If items are not loaded with include, this will fetch them.
  // Returns { subtotal, gstAmount, grandTotal }
  // -----------------------
  Order.prototype.calculateSummary = async function (options = {}) {
    // this may be a sequelize instance of Order
    let items = this.items;
    if (!items) {
      // fetch items if not present
      items = await OrderItem.findAll({
        where: { orderId: this.orderId },
        ...options,
      });
    }

    const subtotal = items.reduce((s, it) => s + Number(it.quantity) * Number(it.price), 0);
    const gstPercent = Number(this.gstPercent || 0);
    const gstAmount = Math.round((subtotal * gstPercent) / 100);
    const shipping = Number(this.shippingCost || 0);
    const grandTotal = Math.round(subtotal + gstAmount + shipping);

    return { subtotal, gstAmount, shipping, grandTotal };
  };

  // -----------------------
  // Hooks: keep OrderItem.total consistent when item created/updated
  // -----------------------
  OrderItem.beforeCreate((item) => {
    item.total = Number(item.quantity) * Number(item.price);
  });
  OrderItem.beforeUpdate((item) => {
    item.total = Number(item.quantity) * Number(item.price);
  });

  // -----------------------
  // Return all models
  // -----------------------
  return {
    Seller,
    Buyer,
    Order,
    OrderItem,
  };
};