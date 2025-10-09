module.exports = (sequelize, Sequelize) => {
  const BusinessVerification = sequelize.define(
    "businessverification",
    {
      verificationid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      // Official numbers
      gstnumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      pannumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },

      // Business details
      businessname: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // Uploaded document URLs/paths
      gstcertificateurl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pancardurl: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // Verification status & metadata
      isverified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verificationstatus: {
        type: Sequelize.ENUM("NotSubmitted", "Pending", "Approved", "Rejected"),
        allowNull: false,
        defaultValue: "NotSubmitted",
      },
      verifiedby: {
        type: Sequelize.STRING,
        allowNull: true, // admin user id/email who verified
      },
      verifiedat: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rejectionreason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      // Owner / seller reference (optional)
      sellerid: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      // free-form notes
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "businessverifications",
      timestamps: true,
      underscored: false,
    }
  );

  return BusinessVerification;
};