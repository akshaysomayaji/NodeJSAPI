// models/subcategory.server.model.js
module.exports = (sequelize, Sequelize) => {
  const SubCategory = sequelize.define('subcategory', {
    subcategoryid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },

    // human-friendly id like #SC-001
    displayid: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false
    },

    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },

    icon: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL or filepath for uploaded icon'
    },

    parentCategoryId: {
      type: Sequelize.UUID,
      allowNull: false,
      comment: 'FK to categories.categoryid'
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },

    sortOrder: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    createdBy: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    tableName: 'subcategories',
    timestamps: true,
    indexes: [
      { fields: ['displayid'] },
      { fields: ['parentCategoryId'] },
      { fields: ['name'] }
    ]
  });

  return SubCategory;
};