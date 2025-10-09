module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    'order',
    {
      orderid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      paymentStatus: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isIn: [['paid', 'pending', 'failed']],
        },
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      shipping: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      gst: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      grandTotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      buyerName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // createdAt / updatedAt are added by timestamps: true
    },
    {
      tableName: 'orders',
      timestamps: true,
      underscored: false,
    }
  );

  return Order;
};