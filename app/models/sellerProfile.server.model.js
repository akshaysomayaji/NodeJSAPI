module.exports = (sequelize, Sequelize) => {
  const SellerProfile = sequelize.define("sellerProfile", {
    sellerId: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    storeLogo: {
      type: Sequelize.STRING, // image URL or file path
      allowNull: true,
    },

    storeName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    businessCategory: {
      type: Sequelize.STRING, // example: "Fashion", "Electronics"
      allowNull: false,
    },

    location: {
      type: Sequelize.STRING, // e.g. "Mumbai, India"
      allowNull: false,
    },

    phoneCode: {
      type: Sequelize.STRING, // e.g. "+91"
      allowNull: true,
      defaultValue: "+91",
    },

    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [7, 15],
      },
    },

    emailId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    sellerType: {
      type: Sequelize.ENUM("Seller", "Manufacturer"),
      allowNull: false,
    },

    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Active",
    },
  });

  return SellerProfile;
};