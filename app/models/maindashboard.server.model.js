// models/admindashboard.server.model.js
module.exports = (sequelize, Sequelize) => {
  const AdminDashboard = sequelize.define('adminDashboard', {
    dashboardid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },

    // top-level summary counts (cards)
    totalBuyers:     { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    activeBuyers:    { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    pendingBuyerVerifications: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },

    totalSellers:    { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    pendingKYC:      { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    activeSellers:   { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },

    totalManufacturers: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    activeManufacturers:{ type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    newProductSubmissions:{ type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },

    // recentOrders stored as JSON array of small objects for quick display
    // each item: { orderId, buyerName, amount, status, createdAt }
    recentOrders: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    },

    // sellerVerifications stored as JSON array for the verification table
    // each item: { sellerId, sellerName, businessInfo, contact, category, status, actions, createdAt }
    sellerVerifications: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    },

    // admin meta
    lastUpdatedBy: { type: Sequelize.STRING, allowNull: true },
  }, {
    tableName: 'admin_dashboard',
    timestamps: true
  });

  return AdminDashboard;
};