var config = require('./config'),
    { mongoose, connectoptions } = require('mongoose');

module.exports = function () {
    //var options = { connect: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 0, socketTimeoutMS: 0 } } };
    mongoose.Promise = global.Promise;
    var db = mongoose.connect(config.db);
    require('../app/models/users.server.model.js');
    return db;
};