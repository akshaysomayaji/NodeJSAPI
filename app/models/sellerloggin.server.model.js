// models/selleraccount.server.model.js
module.exports = (sequelize, Sequelize) => {
  const SellerAccount = sequelize.define("selleraccount", {
    sellerid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    // Email-based signup
    emailid: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      validate: { isEmail: true },
    },

    // Phone-based signup
    countrycode: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "+91",
    },
    phonenumber: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },

    // OTP verification
    otp: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    otpexpiry: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    isverified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    // Social login
    googletoken: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    facebooktoken: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    // Account status
    accountstatus: {
      type: Sequelize.ENUM("Pending", "Active", "Blocked"),
      allowNull: false,
      defaultValue: "Pending",
    },
  });

  return SellerAccount;
};