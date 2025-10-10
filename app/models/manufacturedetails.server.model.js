// manufacturedetail.server.model.js
module.exports = (sequelize, Sequelize) => {
  const ManufactureDetail = sequelize.define("manufacturedetail", {
    manufactureid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    // ==== MANUFACTURER DETAILS ====
    companyname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contactperson: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    emailid: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },
    mobilenumber: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Active", // Example: Active / Inactive
    },

    // ==== PRODUCT DETAILS ====
    productname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    stockstatus: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "In Stock", // In Stock / Low Stock / Out of Stock
    },
    stockquantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    // ==== ADMIN / CONTROL DETAILS ====
    createdby: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "Admin or user who added manufacturer",
    }
  }, {
    tableName: "manufacturedetails",
    timestamps: true,
  });

  return ManufactureDetail;
};