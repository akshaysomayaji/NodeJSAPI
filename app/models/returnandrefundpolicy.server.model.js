module.exports = (sequelize, Sequelize) => {

  // === Return Policy Model ===
  const ReturnPolicy = sequelize.define("returnpolicy", {
    policyid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Return & Refund Policy",
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "Easy returns and hassle-free refunds for your peace of mind",
    },
    eligibilityItems: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: ["Damaged Items", "Wrong Item", "Defective Product"],
    },
    refundProcessSteps: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [
        { step: "Pickup", desc: "Free pickup from your location" },
        { step: "Inspection", desc: "Quality check at our facility" },
        { step: "Refund", desc: "Money back to wallet/bank" },
      ],
    },
    nonReturnableTags: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: ["Groceries", "Medicines", "Innerwear", "Perishables"],
    },
  }, {
    tableName: "returnpolicies",
    timestamps: true,
  });


  // === Return Request Model ===
  const ReturnRequest = sequelize.define("returnrequest", {
    returnid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    orderId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    productId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sellerId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    reason: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    detail: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    amount: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "pending", // pending | pickup_scheduled | inspection | refunded | denied
      validate: {
        isIn: [["pending", "pickup_scheduled", "inspection", "refunded", "denied"]],
      },
    },
    pickupScheduledAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    inspectedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    refundedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  }, {
    tableName: "returnrequests",
    timestamps: true,
  });

  // Relation (Optional)
  ReturnRequest.belongsTo(ReturnPolicy, {
    foreignKey: "policyid",
    constraints: false,
  });

  return { ReturnPolicy, ReturnRequest };
};