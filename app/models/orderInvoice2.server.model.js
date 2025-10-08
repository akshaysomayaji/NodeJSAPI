// models/invoice.server.model.js
// Exports a function: (sequelize, DataTypes) => { return { Seller, Buyer, Order, OrderItem }; }

module.exports = (sequelize, DataTypes) => {
  const { UUID, UUIDV4, STRING, TEXT, FLOAT, INTEGER, DATE, BOOLEAN, ENUM, VIRTUAL } = DataTypes;

  // SELLER
  const Seller = sequelize.define('Seller', {
    sellerId: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
    sellerName: { type: STRING, allowNull: false },
    subtitle: { type: STRING },
    address: { type: TEXT, allowNull: false },
    phone: { type: STRING, allowNull: false },
    email: { type: STRING, allowNull: false },
    gstNumber: { type: STRING },
    panNumber: { type: STRING }
  }, { tableName: 'sellers', timestamps: false });

  // BUYER (Manufacturer)
  const Buyer = sequelize.define('Buyer', {
    buyerId: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
    buyerName: { type: STRING, allowNull: false },
    role: { type: STRING, defaultValue: 'Customer' },
    address: { type: TEXT, allowNull: false },
    phone: { type: STRING, allowNull: false },
    email: { type: STRING, allowNull: false }
  }, { tableName: 'buyers', timestamps: false });

  // ORDER ITEM
  const OrderItem = sequelize.define('OrderItem', {
    itemId: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
    productName: { type: STRING, allowNull: false },
    productDescription: { type: STRING },
    quantity: { type: INTEGER, allowNull: false, defaultValue: 1 },
    price: { type: FLOAT, allowNull: false, defaultValue: 0 },
    total: { type: FLOAT, allowNull: false, defaultValue: 0 }
  }, { tableName: 'order_items', timestamps: false });

  // ORDER
  const Order = sequelize.define('Order', {
    orderId: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
    orderNumber: { type: STRING, allowNull: false, unique: true },
    orderDate: { type: DATE, allowNull: false },
    status: { type: STRING, allowNull: false, defaultValue: 'Delivered' },

    // financials
    shippingCost: { type: FLOAT, allowNull: false, defaultValue: 0 },
    gstPercent: { type: FLOAT, allowNull: false, defaultValue: 18 },

    // payment info
    paymentMethod: { type: ENUM('Cash', 'UPI', 'Card', 'NetBanking', 'Other'), allowNull: false, defaultValue: 'UPI' },
    paymentStatus: { type: ENUM('Pending', 'Paid', 'Failed', 'Refunded'), allowNull: false, defaultValue: 'Paid' },

    // print info
    isPrinted: { type: BOOLEAN, allowNull: false, defaultValue: false },
    printedAt: { type: DATE, allowNull: true },

    // computed virtuals (work when items are included)
    subtotal: {
      type: VIRTUAL,
      get() {
        const items = this.getDataValue('items') || this.items || [];
        if (!items || items.length === 0) return 0;
        return items.reduce((acc, it) => acc + (Number(it.quantity || 0) * Number(it.price || 0)), 0);
      }
    },
    gstAmount: {
      type: VIRTUAL,
      get() {
        const sub = this.get('subtotal') || 0;
        const p = Number(this.getDataValue('gstPercent') || this.gstPercent || 0);
        return Math.round((sub * p) / 100);
      }
    },
    grandTotal: {
      type: VIRTUAL,
      get() {
        const sub = Number(this.get('subtotal') || 0);
        const gst = Number(this.get('gstAmount') || 0);
        const ship = Number(this.getDataValue('shippingCost') || this.shippingCost || 0);
        return Math.round(sub + gst + ship);
      }
    }

  }, { tableName: 'orders', timestamps: false });

  // Associations
  Seller.hasMany(Order, { foreignKey: 'sellerId', as: 'orders' });
  Buyer.hasMany(Order, { foreignKey: 'buyerId', as: 'orders' });

  Order.belongsTo(Seller, { foreignKey: 'sellerId', as: 'seller' });
  Order.belongsTo(Buyer, { foreignKey: 'buyerId', as: 'buyer' });
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });

  OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

  // Hooks to ensure totals are correct
  OrderItem.beforeCreate((item) => {
    item.total = Number(item.quantity) * Number(item.price);
  });
  OrderItem.beforeUpdate((item) => {
    item.total = Number(item.quantity) * Number(item.price);
  });

  // instance helper to calculate summary even if items aren't loaded
  Order.prototype.calculateSummary = async function (opts = {}) {
    const items = this.items || await OrderItem.findAll({ where: { orderId: this.orderId }, ...opts });
    const subtotal = items.reduce((s, it) => s + (Number(it.quantity) * Number(it.price)), 0);
    const gstAmount = Math.round((subtotal * (this.gstPercent || 0)) / 100);
    const shipping = Number(this.shippingCost || 0);
    const grandTotal = Math.round(subtotal + gstAmount + shipping);
    return { subtotal, gstAmount, shipping, grandTotal };
  };

  return { Seller, Buyer, Order, OrderItem };
};