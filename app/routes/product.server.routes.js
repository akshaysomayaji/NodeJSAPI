var _products = require('../../app/controllers/products.server.controller');
const { authenticate, authorizeRoles } = require("../helpers/authorizationHelper");

module.exports = function (app) {
    app.route('/api/product/add').post(authorizeRoles("ADMIN"),_products.addProduct);
    app.route('/api/product/get').post(authorizeRoles("ADMIN"),_products.getproductdetails);
    app.route('/api/product/get/:id').get(authorizeRoles("ADMIN"), _products.getproduct);
    app.route('/api/product/update/:id').put(authorizeRoles("ADMIN"), _products.update);
    app.route('/api/product/delete/:id').delete(authorizeRoles("ADMIN"), _products.deleteproduct);
    app.route('/api/product/category/search/:categoryid/:subcategoryid').get(authorizeRoles("ADMIN"), _products.searchproduct);
    app.route('/api/product/cart/add').get(authorizeRoles("ADMIN"), _products.addtocart);
    app.route('/api/product/update/status').put(authorizeRoles("ADMIN"), _products.updateproductstatus);
    app.route('/api/product/search').get(authorizeRoles("ADMIN","SELLER","BUYER"),_products.search)
}