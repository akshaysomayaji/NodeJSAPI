module.exports = (sequelize, Sequelize) => {
  const Profile = sequelize.define('profile', {
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },


    fullName: {
      type: Sequelize.STRING,
      allowNull: false
    },

    
    avatarUrl: {
      type: Sequelize.STRING,
      allowNull: true
    },

    location: {
      type: Sequelize.STRING,
      allowNull: true
    },

    phone: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    },

    
    totalOrders: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    pendingRequests: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    favoritesCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    
    supportUrl: {
      type: Sequelize.STRING,
      allowNull: true
    },

    aboutText: {
      type: Sequelize.TEXT,
      allowNull: true
    },

    termsText: {
      type: Sequelize.TEXT,
      allowNull: true
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }

  }, {
    timestamps: true,
    tableName: 'profile'
  });

  return Profile;
};