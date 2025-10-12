const dashboardCtrl = require('../../app/controllers/admindashboard.server.controller');
const { authenticate, authorizeRoles } = require("../helpers/authorizationHelper");
module.exports = function (app) {
    app.route('/api/dashboard/admin').get(authorizeRoles("ADMIN"),dashboardCtrl.getdashboardcontent);
}

