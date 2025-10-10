// models/buyer.server.model.js
module.exports = (sequelize, Sequelize) => {
  const Buyer = sequelize.define('buyer', {
    buyerid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },

    displayid: { type: Sequelize.STRING, allowNull: true, unique: true },

    fullname: { type: Sequelize.STRING, allowNull: false },
    emailid: { type: Sequelize.STRING, allowNull: true, validate: { isEmail: true } },
    mobilenumber: { type: Sequelize.STRING, allowNull: true },
    avatarurl: { type: Sequelize.STRING, allowNull: true },

    registrationDate: { type: Sequelize.DATE, allowNull: true },
    lastActive: { type: Sequelize.DATE, allowNull: true },
    totalOrders: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },

    // Admin / verification fields used by quick actions:
    isVerified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    verificationNotes: { type: Sequelize.TEXT, allowNull: true },

    isSuspended: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    adminNotes: { type: Sequelize.TEXT, allowNull: true },

    // Payment approval fields
    paymentApproved: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    paymentRef: { type: Sequelize.STRING, allowNull: true },

    status: {
      type: Sequelize.ENUM('Active', 'Inactive'),
      allowNull: false,
      defaultValue: 'Active'
    }

  }, {
    tableName: 'buyers',
    timestamps: true,
    indexes: [
      { fields: ['displayid'] },
      { fields: ['emailid'] }
    ]
  });

  return Buyer;
};