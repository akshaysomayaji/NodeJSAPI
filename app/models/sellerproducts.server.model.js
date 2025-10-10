// models/sellermanagement.server.model.js
module.exports = (sequelize, Sequelize) => {
  const Seller = sequelize.define('seller', {
    sellerid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },

    // human-friendly id shown in UI (e.g. SLR-001)
    displayid: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      comment: 'Human readable id like SLR-001'
    },

    // Seller / Store info
    storename: {
      type: Sequelize.STRING,
      allowNull: false
    },
    ownername: {
      type: Sequelize.STRING,
      allowNull: true
    },

    // Contact fields (similar style to your userdetail model)
    emailid: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: { isEmail: true }
    },
    mobilenumber: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true
    },

    // Listing-related fields shown in table
    category: {
      type: Sequelize.STRING,
      allowNull: true
    },
    productcount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    // Status badge (Active / Inactive / Suspended etc.)
    status: {
      type: Sequelize.ENUM('Active', 'Inactive', 'Suspended', 'Pending'),
      allowNull: false,
      defaultValue: 'Active'
    },

    // optional summary/notes (not visible to buyers)
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Internal notes (not visible to buyers)'
    },

    // audit / admin
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