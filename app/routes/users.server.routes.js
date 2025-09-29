var _userdetails = require('../../app/controllers/userdetails.server.controller'),
_auth = require('../../app/controllers/auth.server.controller'),
    passport = require('passport');

module.exports = function (app) {
    app.route('/api/login').post(_auth.authentication);
    app.route('/api/user/register').post(_userdetails.register);
    app.route('/api/user/get/:id').get(_userdetails.getuserdetails);
    app.route('/api/user/getall').get(_userdetails.getallusers);
}