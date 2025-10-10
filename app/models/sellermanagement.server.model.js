// models/seller.server.model.js
module.exports = (sequelize, Sequelize) => {
  const Seller = sequelize.define('seller', {
    sellerid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },

    // human-friendly id shown in UI (e.g. #12345)
    displayid: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      comment: 'Human readable id like #12345'
    },

    // Profile / Store
    storename: {
      type: Sequelize.STRING,
      allowNull: false
    },
    ownername: {
      type: Sequelize.STRING,
      allowNull: true
    },

    // Contact fields (similar to userdetail)
    emailid: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: { isEmail: true }
    },
    mobilenumber: {
      type: Sequelize.STRING,
      allowNull: true
    },

    // Listing columns shown in UI
    category: {
      type: Sequelize.STRING,
      allowNull: true
    },
    productcount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    orderscount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    // Status / joined / other display fields
    status: {
      type: Sequelize.ENUM('Active', 'Inactive', 'Suspended', 'Pending'),
      allowNull: false,
      defaultValue: 'Active'
    },
    joinedAt: {
      type: Sequelize.DATE,
      allowNull: true
    },

    // admin/internal
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Internal notes (not visible to buyers)'
    },
    createdby: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    tableName: 'sellers',
    timestamps: true,
    indexes: [
      { fields: ['storename'] },
      { fields: ['displayid'] },
      { fields: ['category'] },
      { fields: ['status'] }
    ]
  });

  return Seller;
};