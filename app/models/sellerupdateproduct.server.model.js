module.exports = (sequelize, Sequelize) => {
  const ProductDetail = sequelize.define("productdetail", {
    productid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    // Basic Information
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

    // Product Images (stored as array of URLs/paths)
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

    // Stock details
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

    // Category & Details
    category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    subcategory: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    brand: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    // Product Tags
    tags: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
    },

    // Product Status
    productstatus: {
      type: Sequelize.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
  });

  return ProductDetail;
}