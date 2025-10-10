// orderdetail.server.model.js
module.exports = (sequelize, Sequelize) => {
  const OrderDetail = sequelize.define("orderdetail", {
    orderid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    // ==== CUSTOMER DETAILS ====
    fullname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mobilenumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    emailid: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    deliveryaddress: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    // ==== ORDERED PRODUCT DETAILS ====
    productname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unitprice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    totalamount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },

    // ==== ORDER STATUS ====
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "payment request", // like in your image
    },

    // ==== ADDITIONAL DETAILS ====
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "Internal notes not visible to buyer",
    }
  }, {
    tableName: "orderdetails",
    timestamps: true,
  });

  return OrderDetail;
};