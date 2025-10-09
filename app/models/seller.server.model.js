// models/seller.server.model.js
// Usage: const Seller = require('./seller.server.model')(sequelize, Sequelize);

module.exports = (sequelize, Sequelize) => {
  const Seller = sequelize.define(
    'seller',
    {
      sellerid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      // Basic profile
      businessName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ownerName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        validate: { isEmail: true },
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },

      // profile meta shown in header
      avatarUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sellerSince: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      // Business / payment / preferences (minimal fields per UI tabs)
      businessType: { type: Sequelize.STRING, allowNull: true },
      gstin: { type: Sequelize.STRING, allowNull: true },
      bankAccount: { type: Sequelize.STRING, allowNull: true },
      preferredCurrency: { type: Sequelize.STRING, allowNull: true, defaultValue: 'INR' },

      // security
      passwordHash: { type: Sequelize.STRING, allowNull: true },

      // small flags
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
      tableName: 'sellers',
      timestamps: true,
    }
  );

  return Seller;
};