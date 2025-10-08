module.exports = (sequelize, Sequelize) => {
  const OnboardingPreference = sequelize.define("onboardingPreference", {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },

    // If you have a users table, store the user's id (optional)
    userId: {
      type: Sequelize.UUID,
      allowNull: true
    },

    // "Buyer" or "Seller"
    userType: {
      type: Sequelize.ENUM("Buyer", "Seller"),
      allowNull: false
    },

    // Optional extra info (e.g., reason, subrole)
    meta: {
      type: Sequelize.JSON, // store small JSON like { interest: "wholesale" }
      allowNull: true
    },

    // Used by UI to know if selection is complete
    completed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },

    // Optional: store where they came from (landing page, referral)
    source: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    underscored: true,
    timestamps: true
  });

  return OnboardingPreference;
};