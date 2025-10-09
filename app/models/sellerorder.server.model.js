// models/order.server.model.js
module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    "order",
    {
      orderid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      // A human-friendly order number shown in list (#12345)
      ordernumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      // CUSTOMER (displayed in the list)
      customername: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customeravatar: {
        type: Sequelize.STRING, // url/path to avatar image
        allowNull: true,
      },
      customernumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      customeremail: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: { isEmail: true },
      },

      // PRODUCTS shown in the list: keep as JSON array for quick admin display
      // Example: [{ productId, name, qty, pricePerUnit, subtotal }, ...]
      products: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
      },

      // Pricing summary
      subtotalamount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      shippingamount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      totalamount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },

      // ORDER / UI STATES (badges in the list)
      orderdate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      paymentstatus: {
        type: Sequelize.ENUM("Paid", "Pending", "Failed", "Refunded"),
        allowNull: false,
        defaultValue: "Pending",
      },

      orderstatus: {
        type: Sequelize.ENUM(
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
          "ReturnRequested",
          "ReturnApproved",
          "ReturnDenied",
          "ReturnPending"
        ),
        allowNull: false,
        defaultValue: "Pending",
      },

      // Return request metadata (used by list to show "return request", "return approved", etc.)
      isreturnrequested: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      returnstatus: {
        type: Sequelize.ENUM("None", "Pending", "Accepted", "Denied"),
        allowNull: false,
        defaultValue: "None",
      },

      // Cancellation metadata
      cancelled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      // small admin flags for quick display (optional)
      isshipped: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isdelivered: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      // Optional references for relations
      buyerid: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      sellerid: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      // internal notes (not shown in list but useful)
      internalnotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "orders",
      timestamps: true, // createdAt, updatedAt
      underscored: false,
    }
  );

  // Add simple indexes to speed up list queries (status, ordernumber)
  try {
    Order.addIndex && Order.addIndex({ fields: ["orderstatus"] });
    Order.addIndex && Order.addIndex({ fields: ["paymentstatus"] });
    Order.addIndex && Order.addIndex({ fields: ["ordernumber"] });
  } catch (e) {
    // ignore if addIndex not available in some runtime contexts
  }

  return Order;
};