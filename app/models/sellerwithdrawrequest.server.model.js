// models/sellerWithdraw.server.model.js
module.exports = (sequelize, Sequelize) => {
  const SellerWithdraw = sequelize.define('sellerWithdraw', {
    withdrawid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },

    // human-friendly id shown in UI (e.g. #SWL001)
    displayid: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      comment: 'Human readable id like #SWL001'
    },

    // seller reference (store seller id or name snapshot)
    sellerId: {
      type: Sequelize.UUID,
      allowNull: false,
      comment: 'FK to sellers.sellerid (optional)'
    },
    sellerName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    contactEmail: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: { isEmail: true }
    },
    contactPhone: {
      type: Sequelize.STRING,
      allowNull: true
    },

    // amount and currency
    amount: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'INR'
    },

    // request metadata
    requestDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },

    // status enum (matches UI badges)
    status: {
      type: Sequelize.ENUM('Pending','Approved','Denied','Completed','Rejected'),
      allowNull: false,
      defaultValue: 'Pending'
    },

    // optional admin notes / transaction reference
    adminNotes: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    transactionRef: {
      type: Sequelize.STRING,
      allowNull: true
    },

    createdBy: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    tableName: 'seller_withdraws',
    timestamps: true,
    indexes: [
      { fields: ['displayid'] },
      { fields: ['sellerId'] },
      { fields: ['status'] },
      { fields: ['requestDate'] }
    ]
  });

  return SellerWithdraw;
};