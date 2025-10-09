module.exports = (sequelize, Sequelize) => {
  const SellerDashboard = sequelize.define("sellerdashboard", {
    dashboardid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    // Seller Information
    sellername: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    pannumber: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    availablefunds: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    fundsupdatedate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    percentagegrowth: {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0.0, // example: +12% growth
    },

    // Dashboard Stats
    totalproducts: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    orderstoday: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ordersdelivered: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    customerinquiries: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    // Earnings Overview Chart Data
    earningsoverview: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [], // e.g. [{ day: "Mon", amount: 200 }, { day: "Tue", amount: 300 }]
    },

    // Recent Orders (mini list)
    recentorders: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [], 
      // Example:
      // [{ orderid: "ORD-2024-001", product: "Wireless Headphones", price: 129.99, status: "Delivered" }]
    },

    // Top Selling Products
    topsellingproducts: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [], 
      // Example:
      // [{ product: "Wireless Headphones", category: "Electronics", sold: 156 }]
    },
  });

  return SellerDashboard;
};