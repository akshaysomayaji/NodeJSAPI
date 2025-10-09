// orderdetail.server.model.js
// Save as models/orderdetail.server.model.js
// Usage: const OrderDetail = require('./orderdetail.server.model')(sequelize, Sequelize);

module.exports = (sequelize, Sequelize) => {
  const OrderDetail = sequelize.define(
    "orderdetail",
    {
      // Primary key
      orderid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      /* ----------------------
         CUSTOMER DETAILS
         ---------------------- */
      customername: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mobilenumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emailid: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: { isEmail: true },
      },
      deliveryaddress: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      /* ----------------------
         ORDERED PRODUCTS
         - stored as JSON to match admin UI list
         - example: [{ productId, name, qty, pricePerUnit, subtotal }, ...]
         ---------------------- */
      orderitems: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
      },

      /* ----------------------
         PRICING SUMMARY
         ---------------------- */
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

      /* ----------------------
         PAYMENT & ORDER STATUS
         ---------------------- */
      paymentstatus: {
        type: Sequelize.ENUM("Paid", "Pending", "Failed"),
        allowNull: false,
        defaultValue: "Pending",
      },

      /*
        orderstatus includes values used by the UI and admin actions.
        Add/remove values according to your workflow.
      */
      orderstatus: {
        type: Sequelize.ENUM(
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
          "ReturnAccepted",
          "ReturnPending"
        ),
        allowNull: false,
        defaultValue: "Pending",
      },

      /* expected delivery date (date picker in UI) */
      expecteddeliverydate: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      /* boolean flags for shipped / delivered (useful for quick checks) */
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

      /* ----------------------
         INTERNAL / ADMIN FIELDS
         ---------------------- */
      internalnotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      /* ----------------------
         CANCELLATION METADATA
         ---------------------- */
      cancelled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cancelreason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cancelledby: {
        type: Sequelize.STRING,
        allowNull: true, // admin or buyer identifier
      },
      cancelledat: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      /* ----------------------
         RETURN REQUEST WORKFLOW
         ---------------------- */
      // buyer has requested a return (UI toggle / request area)
      returnrequest: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      // admin decision track
      returnstatus: {
        type: Sequelize.ENUM("Pending", "Accepted", "Denied"),
        allowNull: false,
        defaultValue: "Pending",
      },
      returndecisionby: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      returndecisionat: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      returndecisionnotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      /* ----------------------
         OPTIONAL REFERENCES / METADATA
         ---------------------- */
      sellerid: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      buyerid: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      createdby: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "orderdetails",
      timestamps: true,
      underscored: false,
    }
  );

  // Add an index for faster status queries (optional)
  try {
    OrderDetail.addIndex && OrderDetail.addIndex({ fields: ["orderstatus"] });
    OrderDetail.addIndex && OrderDetail.addIndex({ fields: ["paymentstatus"] });
  } catch (e) {
    // some sequelize versions/contexts don't allow indexes at runtime; ignore
  }

  return OrderDetail;
};