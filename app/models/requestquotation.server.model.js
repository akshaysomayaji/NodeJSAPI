module.exports = (sequelize, Sequelize) => {
  const QuoteRequest = sequelize.define('quoterequest', {
    requestId: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },

    userId: {
      type: Sequelize.UUID,
      allowNull: false
    },

    productId: {
      type: Sequelize.UUID,
      allowNull: true
    },

    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },

    budgetRange: {
      type: Sequelize.STRING,
      allowNull: true
    },

    deliveryLocation: {
      type: Sequelize.STRING,
      allowNull: true
    },

    notes: {
      type: Sequelize.TEXT,
      allowNull: true
    },

    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },

    response: {
      type: Sequelize.JSON,
      allowNull: true
    },

    meta: {
      type: Sequelize.JSON,
      allowNull: true
    }

  }, {
    timestamps: true,
    tableName: 'quoterequest'
  });

  return QuoteRequest;
};