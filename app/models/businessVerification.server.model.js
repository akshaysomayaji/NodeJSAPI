module.exports = (sequelize, Sequelize) => {
  const BusinessVerification = sequelize.define("businessVerification", {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    gstNumber: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      validate: {
        // optional basic format validation; adjust if needed
        len: [15, 15],
      },
    },

    panNumber: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      validate: {
        len: [10, 10],
      },
    },

    businessName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    gstCertificateUrl: {
      type: Sequelize.STRING, // saved file path or URL
      allowNull: true,
    },

    panCardUrl: {
      type: Sequelize.STRING, // saved file path or URL
      allowNull: true,
    },

    // verification status: Pending / Verified / Rejected
    verificationStatus: {
      type: Sequelize.ENUM("Pending", "Verified", "Rejected"),
      defaultValue: "Pending",
      allowNull: false,
    },

    // optional admin notes
    adminNotes: {
      type: Sequelize.TEXT,
      allowNull: true,
    }
  }, {
    underscored: true,
    timestamps: true
  });

  return BusinessVerification;
};