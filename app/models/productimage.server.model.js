module.exports = (sequelize, Sequelize) => {
  const ProductImage = sequelize.define('productimage', {
    imageId: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },

    productId: {
      type: Sequelize.UUID,
      allowNull: false
    },

    url: {
      type: Sequelize.STRING,
      allowNull: false
    },

    // order of image in gallery
    position: { type: Sequelize.INTEGER, defaultValue: 0 },

    altText: { type: Sequelize.STRING, allowNull: true }
  }, {
    timestamps: false,
    tableName: 'productimage'
  });

  return ProductImage;
};