module.exports = (sequelize, DataTypes) => {
  const SortPreference = sequelize.define('SortPreference', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      
    },
    sortBy: {
      type: DataTypes.ENUM(
        'relevance',
        'price_low_high',
        'price_high_low',
        'newest',
        'verified_suppliers'
      ),
      allowNull: false,
      defaultValue: 'relevance'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'sort_preferences',
    timestamps: false 
  });


  return SortPreference;
};