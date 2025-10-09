module.exports = (sequelize, Sequelize) => {
  const productDetails = sequelize.define("productdetails", {
    productId: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    productName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    productDescription: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    category: {
      type: Sequelize.STRING, // Example: "Electronics", "Fashion", "Construction"
      allowNull: false,
    },

    imageUrl: {
      type: Sequelize.STRING, // Product image link
      allowNull: true,
    },

    manufacturerName: {
      type: Sequelize.STRING, // Example: "TechCorp", "TATA"
      allowNull: true,
    },

    price: {
      type: Sequelize.INTEGER, // ₹ value
      allowNull: false,
    },

    moq: {
      type: Sequelize.INTEGER, // Minimum order quantity (e.g., 15)
      allowNull: true,
      defaultValue: 1,
    },

    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Whether supplier is verified
    },

    trending: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // For "Trending by Sellers" section
    },

    popular: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // For "Most Popular" section
    },

    rating: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },

    supplierType: {
      type: Sequelize.STRING, // Example: "Manufacturer", "Retailer"
      allowNull: true,
    },

    location: {
      type: Sequelize.STRING, // Example: "India", "Bangalore"
      allowNull: true,
    },

    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Available",
    },
  });

  return productDetails;
};