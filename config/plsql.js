var config = require('./config');
var Sequelize = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
        max: config.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    }
});
module.exports = function () {
    const db = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    db.Customer = require('../app/models/userdetail.server.model.js')(sequelize, Sequelize);
    return db;
}