// models/manufacturermanagement.server.model.js
module.exports = (sequelize, Sequelize) => {
  const Manufacturer = sequelize.define('manufacturer', {
    manufactureid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    // human-friendly display id shown in UI (e.g. MFG-001)
    displayid: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      comment: 'Human readable id like MFG-001'
    },

    // Company / Organization info
    companyname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true
    },

    // Contact person details (shown in list)
    contactname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    contactemail: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: { isEmail: true }
    },
    contactphone: {
      type: Sequelize.STRING,
      allowNull: true
    },

    // metadata shown on row (status badge etc.)
    status: {
      type: Sequelize.ENUM('Active', 'Inactive', 'Pending'),
      allowNull: false,
      defaultValue: 'Active'
    },

    // optional aggregated/product info to display in list
    productcount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    // internal / admin fields
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Internal notes (not shown to buyers)'
    },
    createdby: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    tableName: 'manufacturers',
    timestamps: true,
    indexes: [
      { fields: ['companyname'] },
      { fields: ['displayid'] },
      { fields: ['category'] },
      { fields: ['status'] }
    ]
  });

  return Manufacturer;
};