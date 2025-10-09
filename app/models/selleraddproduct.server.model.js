// productdetail.server.model.js
module.exports = (sequelize, Sequelize) => {
  const ProductDetail = sequelize.define("productdetail", {
    productid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    // Category & Sub-category
    category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    subcategory: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    // Brand & Tags
    brand: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    tags: {
      type: Sequelize.JSON, // e.g. ["wireless", "noise-cancelling"]
      allowNull: true,
      defaultValue: [],
    },

    // Product Info
    productname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    skuid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    productdescription: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    // Images (array of image URLs)
    productimages: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
    },

    // Pricing
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    discountprice: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },

    // Stock
    stockquantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lowstockalert: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lowstockunits: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    // Product Status
    productstatus: {
      type: Sequelize.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
  });

  return ProductDetail;
};