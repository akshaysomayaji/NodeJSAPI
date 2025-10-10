// models/sellerDetail.server.model.js
module.exports = (sequelize, Sequelize) => {
  const SellerDetail = sequelize.define('sellerDetail', {
    sellerid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },

    // display id (shown as #SU004 etc)
    displayid: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      comment: 'Human readable id like #SU004'
    },

    // Seller basic info (row columns + profile)
    sellername: {
      type: Sequelize.STRING,
      allowNull: false
    },
    product: {
      type: Sequelize.STRING,
      allowNull: true
    },
    manufacturecompany: {
      type: Sequelize.STRING,
      allowNull: true
    },

    // counts shown in table row
    orderscount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    // contact/profile
    emailid: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: { isEmail: true }
    },
    mobilenumber: {
      type: Sequelize.STRING,
      allowNull: true
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true
    },
    avatarurl: {
      type: Sequelize.STRING,
      allowNull: true
    },

    // status column (badges in UI)
    status: {
      type: Sequelize.ENUM(
        'Verified','payment request','Pending','Shipped','return request',
        'return approved','deny','return denied','Delivered','Inactive'
      ),
      allowNull: false,
      defaultValue: 'Pending'
    },

    // Joined / small metadata
    joinedAt: {
      type: Sequelize.DATE,
      allowNull: true
    },

    // internal/admin
    internalNotes: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Internal notes not visible to buyers'
    },
    createdby: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    tableName: 'seller_details',
    timestamps: true,
    indexes: [
      { fields: ['displayid'] },
      { fields: ['sellername'] },
      { fields: ['status'] },
      { fields: ['manufacturecompany'] }
    ]
  });

  return SellerDetail;
};