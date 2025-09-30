var _auth = require('../../app/controllers/auth.server.controller');

module.exports = function (app) {
    app.route('/api/login').post(_auth.authentication);
    app.route('/api/logout').get(_auth.logout);
    app.route('/api/signup').post(_auth.register);
    app.route('/api/forgotpassword').get(_auth.forgotpassword);
    app.route('/api/resetpassword').post(_auth.resetpassword);
    app.route('/api/checktoken').get(_auth.checktoken);
}