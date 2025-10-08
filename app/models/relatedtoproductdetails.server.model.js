// app/models/related.server.model.js
// Optional: a tiny model to store curated related lists if needed.
// You can skip this if you will query by product flags (isNewArrival/isPopular).
module.exports = (sequelize, Sequelize) => {
  const Related = sequelize.define('related', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
    name: { type: Sequelize.STRING, allowNull: false }, // e.g., 'New Arrivals'
    productIds: { type: Sequelize.JSON, allowNull: false } // array of productIds
  }, {
    timestamps: true,
    tableName: 'related'
  });

  return Related;
};