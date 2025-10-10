// models/buyer.server.model.js
module.exports = (sequelize, Sequelize) => {
  const Buyer = sequelize.define('buyer', {
    buyerid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },

    // human-readable id shown in UI (e.g. #B1234)
    displayid: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      comment: 'Human readable id like #B1234'
    },

    // Profile fields
    fullname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    emailid: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: { isEmail: true }
    },
    mobilenumber: {
      type: Sequelize.STRING,
      allowNull: true
    },
    avatarurl: {
      type: Sequelize.STRING,
      allowNull: true
    },

    // Activity / stats shown in table
    registrationDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    lastActive: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'When the user was last active'
    },
    totalOrders: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    // status badge (Active / Inactive / Suspended)
    status: {
      type: Sequelize.ENUM('Active', 'Inactive', 'Suspended'),
      allowNull: false,
      defaultValue: 'Active'
    },

    // admin/internal notes
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Internal notes (not visible to public)'
    },

    createdby: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    tableName: 'buyers',
    timestamps: true,
    indexes: [
      { fields: ['displayid'] },
      { fields: ['fullname'] },
      { fields: ['emailid'] },
      { fields: ['status'] }
    ]
  });

  return Buyer;
};