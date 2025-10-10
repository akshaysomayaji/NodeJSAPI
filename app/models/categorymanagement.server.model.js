// models/category.server.model.js
module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define('category', {
    categoryid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },

    // human-friendly id shown in UI (e.g. #D01)
    displayid: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      comment: 'Human readable id like #D01'
    },

    // Category fields
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    // small icon name or URL used by the UI
    icon: {
      type: Sequelize.STRING,
      allowNull: true
    },

    // allow nested categories (parentCategoryId)
    parentCategoryId: {
      type: Sequelize.UUID,
      allowNull: true
    },

    // status toggle shown in list
    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },

    // optional ordering/index and admin notes
    sortOrder: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Internal notes'
    },

    createdBy: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    tableName: 'categories',
    timestamps: true,
    indexes: [
      { fields: ['displayid'] },
      { fields: ['name'] },
      { fields: ['isActive'] },
      { fields: ['parentCategoryId'] }
    ]
  });

  return Category;
};