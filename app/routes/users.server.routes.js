var _userdetails = require('../../app/controllers/userdetails.server.controller'),
_auth = require('../../app/controllers/auth.server.controller'),
    passport = require('passport');
const { authenticate, authorizeRoles } = require("../helpers/authorizationHelper");

module.exports = function (app) {
    app.route('/api/user/add').post(authorizeRoles("admin"),_userdetails.register);
    app.route('/api/user/get/:id').get(authorizeRoles("admin"),_userdetails.getuserdetails);
    app.route('/api/user/getall').get(authorizeRoles("admin"),_userdetails.getallusers);
    app.route('/api/user/approve/:id').put(authorizeRoles("admin"),_userdetails.approve);
}