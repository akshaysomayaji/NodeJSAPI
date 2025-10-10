// models/categorycreate.server.model.js
module.exports = (sequelize, Sequelize) => {
  const CategoryCreate = sequelize.define("categorycreate", {
    categoryid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    categoryname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    icon: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "Stores file path or URL of uploaded icon"
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true // true = Active, false = Inactive
    }
  }, {
    tableName: "categories",
    timestamps: true
  });

  return CategoryCreate;
};