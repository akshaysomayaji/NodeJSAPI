module.exports = (sequelize, Sequelize) => {
  const LogoutDetail = sequelize.define("logoutdetail", {
    logoutid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    sellerid: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    confirmationmessage: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "Are you sure you want to log out of your seller account?",
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "Pending", // Pending | Confirmed
    },
    loggedoutat: {
      type: Sequelize.DATE,
      allowNull: true,
    }
  }, {
    tableName: "logoutdetails",
    timestamps: true,
  });

  return LogoutDetail;
};