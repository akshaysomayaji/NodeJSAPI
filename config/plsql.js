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
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.userdetails = require('../app/models/userdetail.server.model.js')(sequelize, Sequelize);
db.UserPasswordDetail = require('../app/models/userpassword.server.model.js')(sequelize, Sequelize);
module.exports = db;