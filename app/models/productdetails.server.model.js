module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define('product', {
    productId: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false
    },

    description: {
      type: Sequelize.TEXT,
      allowNull: true
    }
    
    price: {
      type: Sequelize.DECIMAL(12,2),
      allowNull: false,
      defaultValue: 0
    },

    moq: {
      type: Sequelize.INTEGER,
      allowNull: true
    },

    rating: {
      type: Sequelize.DECIMAL(2,1),
      allowNull: true
    },

    sellerName: {
      type: Sequelize.STRING,
      allowNull: true
    },

    colors: {
      type: Sequelize.JSON,
      allowNull: true
    },

    sizes: {
      type: Sequelize.JSON,
      allowNull: true
    },

    isNewArrival: { type: Sequelize.BOOLEAN, defaultValue: false },
    isPopular: { type: Sequelize.BOOLEAN, defaultValue: false },
    isBestSeller: { type: Sequelize.BOOLEAN, defaultValue: false },

    meta: { type: Sequelize.JSON, allowNull: true },

    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    timestamps: true,
    tableName: 'product'
  });

  return Product;
};