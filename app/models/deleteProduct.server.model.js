// models/product.server.model.js
// Sequelize model for products with fields matching your image
module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("Product", {
    productId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    productName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sku: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    productStatus: {
      type: Sequelize.ENUM("Active", "Inactive", "Deleted"),
      allowNull: false,
      defaultValue: "Active",
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  }, {
    tableName: "products",
    timestamps: true,
  });

  return Product;
};