var business = require('../../app/controllers/business.server.controller');
const { authenticate, authorizeRoles } = require("../helpers/authorizationHelper");
module.exports = function (app) {
    app.route('/api/business/add').post(authorizeRoles("admin","seller"),business.addBusinessDetails);
}