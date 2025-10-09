const bcrypt = require("bcryptjs");

module.exports = (sequelize, Sequelize) => {
  const UserAccount = sequelize.define("userAccount", {
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    phoneCode: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "+91",
    },

    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [7, 15],
      },
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    location: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    role: {
      type: Sequelize.ENUM("Buyer", "Seller", "Admin"),
      allowNull: false,
      defaultValue: "Buyer",
    },

    accountStatus: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Active",
    },

    socialLoginProvider: {
      type: Sequelize.STRING, // e.g. "google", "facebook", "linkedin"
      allowNull: true,
    },
  });

  // Hash password before saving
  UserAccount.beforeCreate(async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  return UserAccount;
};