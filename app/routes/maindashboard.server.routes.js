const dashboardCtrl = require('../../app/controllers/admindashboard.server.controller');
const sellerdashboardCtrl = require('../../app/controllers/sellerdashboard.server.controller');
const { authenticate, authorizeRoles } = require("../helpers/authorizationHelper");
module.exports = function (app) {
    app.route('/api/dashboard/admin').get(authorizeRoles("ADMIN"), dashboardCtrl.getdashboardcontent);
    app.route('/api/dashboard/seller').get(authorizeRoles("SELLER"), sellerdashboardCtrl.getdashboardcontent);
}

