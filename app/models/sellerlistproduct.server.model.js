// productlist.server.model.js
module.exports = (sequelize, Sequelize) => {
  const ProductList = sequelize.define("productlist", {
    productid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    productname: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    skuid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    stockquantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    stockstatus: {
      type: Sequelize.ENUM("In Stock", "Low Stock", "Out of Stock"),
      allowNull: false,
      defaultValue: "In Stock",
    },

    productimage: {
      type: Sequelize.STRING, // store image URL or path
      allowNull: true,
    },

    category: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    productstatus: {
      type: Sequelize.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
  });

  return ProductList;
};