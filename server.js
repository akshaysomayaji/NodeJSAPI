process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config/config'),
	//mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	plsql = require('./config/plsql');
var app = express();
plsql.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.");
});
module.exports = app;
app.listen(config.port);
console.log('Server running on ' + config.serverUrl + ':' + config.port + ' at time ' + new Date());
//console.log(process.env.NODE_ENV + ' Server running on ' + config.serverUrl + ':' + config.port + ' at time ' + new Date());