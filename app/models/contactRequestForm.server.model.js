
module.exports = (sequelize, DataTypes) => {
  const { UUID, UUIDV4, STRING, TEXT, ENUM, BOOLEAN } = DataTypes;

  // ======================
  // Contact Request Model
  // ======================
  const ContactRequest = sequelize.define(
    "ContactRequest",
    {
      requestId: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      categoryName: {
        type: STRING,
        allowNull: false,
      },
      contactInfo: {
        type: STRING,
        allowNull: false,
      },
      description: {
        type: TEXT,
        allowNull: true,
      },
      status: {
        type: ENUM("New", "InProgress", "Resolved", "Closed"),
        allowNull: false,
        defaultValue: "New",
      },
      responseMessage: {
        type: TEXT,
        allowNull: true,
      },
      isSecure: {
        type: BOOLEAN,
        defaultValue: true, // encryption or secure data flag
      },
    },
    {
      tableName: "contact_requests",
      timestamps: true,
    }
  );

  // ======================
  // Support Feature Model
  // ======================
  const SupportFeature = sequelize.define(
    "SupportFeature",
    {
      featureId: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      icon: {
        type: STRING,
        allowNull: false,
      },
      title: {
        type: STRING,
        allowNull: false,
      },
      subtitle: {
        type: STRING,
        allowNull: false,
      },
    },
    {
      tableName: "support_features",
      timestamps: false,
    }
  );

  // Default values can be inserted once if the table is empty
  SupportFeature.seedDefaults = async () => {
    const count = await SupportFeature.count();
    if (count === 0) {
      await SupportFeature.bulkCreate([
        { icon: "⚡", title: "Quick Response", subtitle: "Within 2 hours" },
        { icon: "👨‍💻", title: "Expert Support", subtitle: "Dedicated team" },
        { icon: "🔒", title: "Secure", subtitle: "Encrypted data" },
      ]);
    }
  };

  return { ContactRequest, SupportFeature };
};