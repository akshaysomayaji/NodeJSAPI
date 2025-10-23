var _products = require('../../app/controllers/order.server.controller');
//    addProduct = require("../controllers/addProduct");
const { authenticate, authorizeRoles } = require("../helpers/authorizationHelper");

module.exports = function (app) {
    app.route('/api/order').post(authorizeRoles("BUYER", "SELLER"), _products.orderProduct);
    app.route('/api/order/update').put(authorizeRoles("BUYER", "SELLER"), _products.update);
    app.route('/api/order/get').get(authorizeRoles("BUYER", "SELLER"), _products.getorders);

}
