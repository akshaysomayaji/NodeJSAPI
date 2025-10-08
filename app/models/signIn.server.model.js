module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    emailOrPhone: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    passwordHash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    displayName: {
      type: Sequelize.STRING,
      allowNull: true
    },
    // optional fields
    resetPasswordToken: {
      type: Sequelize.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  return User;
};