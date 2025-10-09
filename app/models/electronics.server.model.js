module.exports = (sequelize, Sequelize) => {
  const ElectronicsCategory = sequelize.define("electronicsCategory", {
    categoryId: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    // Category title shown on UI (Mobiles, Laptops, etc.)
    categoryName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    // Small subtitle shown below the name (Latest smartphones, etc.)
    categoryDescription: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    // Category icon or image (SVG/PNG)
    categoryIconUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    // Section type (to differentiate if used for other categories later)
    sectionType: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Electronics",
    },

    // Order of appearance in the grid
    displayOrder: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    // Whether this category is active or hidden
    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  return ElectronicsCategory;
};