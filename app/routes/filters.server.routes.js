const filterController = require('../controllers/filter.controller');
const { authenticate, authorizeRoles } = require("../helpers/authorizationHelper");

module.exports = function (app) {
    app.route('/api/notification/get').get(authorizeRoles("admin", "seller", "buyer"),filterController.getFilter);
    app.route('/api/notification/save').get(authorizeRoles("admin", "seller", "buyer") ,filterController.saveFilter);
    app.route('/api/notification/reset').get(authorizeRoles("admin", "seller","buyer") ,filterController.resetFilter);
};