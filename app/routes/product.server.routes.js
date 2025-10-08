var _products = require('../../app/controllers/products.server.controller');
const { authenticate, authorizeRoles } = require("../helpers/authorizationHelper");

module.exports = function (app) {
    app.route('/api/product/add').post(authorizeRoles("admin"),_products.addProduct);
    app.route('/api/product/get/:id').get(authorizeRoles("admin"),_products.getproductdetails);
    app.route('/api/product/get').get(authorizeRoles("admin"),_products.getproducts);
    app.route('/api/product/update/:id').put(authorizeRoles("admin"), _products.update);
    app.route('/api/product/delete/:id').delete(authorizeRoles("admin"), _products.deleteproduct);
    app.route('/api/product/category/search/:categoryid/:subcategoryid').get(authorizeRoles("admin"), _products.searchproduct);
    app.route('/api/product/cart/add').get(authorizeRoles("admin"), _products.addtocart);
}