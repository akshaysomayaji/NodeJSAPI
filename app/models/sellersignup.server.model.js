module.exports = (sequelize, Sequelize) => {
  const SellerProfile = sequelize.define("sellerprofile", {
    sellerid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    // Basic Seller / Store Info (from UI)
    storename: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    storelogo: {
      type: Sequelize.STRING, // url or path to uploaded logo
      allowNull: true,
    },
    businesscategory: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    // Contact
    countrycode: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "+1",
    },
    phonenumber: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    emailid: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },

    // Seller type: seller / manufacturer etc.
    sellertype: {
      type: Sequelize.ENUM("Seller", "Manufacturer"),
      allowNull: false,
      defaultValue: "Seller",
    },

    // Verification status or steps
    isverified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verificationstep: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    // Metadata
    createdby: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  }, {
    tableName: "sellerprofiles",
    timestamps: true,
    underscored: false,
  });

  return SellerProfile;
};