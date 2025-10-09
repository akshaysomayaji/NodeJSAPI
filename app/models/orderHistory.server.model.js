module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("OrderDetails", {
    orderId: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    orderNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    productName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    productImage: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    orderDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    orderStatus: {
      type: Sequelize.ENUM(
        "pending",
        "delivered",
        "cancelled",
        "return request",
        "return approved"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
  });

  return Order;
};