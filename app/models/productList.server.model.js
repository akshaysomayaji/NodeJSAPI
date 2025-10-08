module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("productdetails", {
    productId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },

    productName: {
      type: Sequelize.STRING,
      allowNull: false
    },

    category: {
      type: Sequelize.STRING,
      allowNull: false
    },

    imageUrl: {
      type: Sequelize.STRING,
      allowNull: true
    },

    manufacturerName: {
      type: Sequelize.STRING,
      allowNull: false
    },

    price: {
      type: Sequelize.INTEGER,
      allowNull: false
    },

    MOQ: {  // Minimum Order Quantity
      type: Sequelize.INTEGER,
      allowNull: false
    },

    rating: {
      type: Sequelize.FLOAT,
      allowNull: true
    },

    description: {
      type: Sequelize.STRING,
      allowNull: true
    },

    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Available"
    }
  });

  return Product;
};