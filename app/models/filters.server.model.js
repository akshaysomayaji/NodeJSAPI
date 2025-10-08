module.exports = (sequelize, Sequelize) => {
  const FilterPreference = sequelize.define('FilterPreference', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false
      
    },

    category: {
      type: Sequelize.STRING,
      allowNull: true
    },

    // Price range
    priceMin: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    priceMax: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    },

    // Minimum order quantity
    minOrderQty: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    },

    supplierTypes: {
      type: Sequelize.JSON, 
      allowNull: true,
      defaultValue: []
    },

    // Location fields
    country: {
      type: Sequelize.STRING,
      allowNull: true
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true
    },

    // Ratings: minimum rating filter (1..5)
    ratingMin: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    },

    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'filter_preferences',
    timestamps: false
  });

  FilterPreference.beforeSave((pref) => {
    pref.updatedAt = new Date();
  });

  return FilterPreference;
};