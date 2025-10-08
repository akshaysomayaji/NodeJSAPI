module.exports = (sequelize, Sequelize) => {
  const homeDetails = sequelize.define("homeDetails", {
    // --- General Section ---
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },

    location: {
      type: Sequelize.STRING,
      allowNull: true, // e.g., "Hubli, Karnataka"
    },

    searchPlaceholder: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Search for products, suppliers, RFQs..."
    },

    bannerImageUrl: {
      type: Sequelize.STRING,
      allowNull: true, // Main banner image
    },

    bannerOfferText: {
      type: Sequelize.STRING,
      allowNull: true, // e.g., "SALE 40% OFF"
    },

    // --- Category Section ---
    categoryName: {
      type: Sequelize.STRING, // e.g., "Electronics"
      allowNull: true
    },

    categoryIcon: {
      type: Sequelize.STRING, // category icon URL
      allowNull: true
    },

    // --- Recommended Suppliers Section ---
    supplierName: {
      type: Sequelize.STRING, // e.g., "TechCorp Industries"
      allowNull: true
    },

    supplierType: {
      type: Sequelize.STRING, // e.g., "Electronics Manufacturer"
      allowNull: true
    },

    supplierDescription: {
      type: Sequelize.STRING, // e.g., "Premium electronic components..."
      allowNull: true
    },

    supplierRating: {
      type: Sequelize.FLOAT,
      allowNull: true
    },

    supplierActionText: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Contact Supplier"
    },

    // --- People Are Requesting Section ---
    requestItem: {
      type: Sequelize.STRING, // e.g., "100kg Cement"
      allowNull: true
    },

    supplierCount: {
      type: Sequelize.INTEGER, // number of suppliers active/interested
      allowNull: true
    },

    requestStatus: {
      type: Sequelize.STRING, // e.g., "Suppliers Active" / "Suppliers Interested"
      allowNull: true
    },

    // --- Additional Info ---
    sectionType: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "HomeSection", // can be "Banner", "Category", "Supplier", or "Request"
    },

    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Active",
    }
  });

  return homeDetails;
};