var category = require('../../app/controllers/category.server.controller');
const { authenticate, authorizeRoles } = require("../helpers/authorizationHelper");
module.exports = function (app) {
     app.route('/api/category/add').post(authorizeRoles("ADMIN"),category.categoryAdd);
     app.route('/api/category/get').get(authorizeRoles("ADMIN","SELLER"),category.getcategory);
    app.route('/api/category/get/:id').get(authorizeRoles("ADMIN","SELLER"),category.getcategorybyId);
     app.route('/api/category/update/:id').get(authorizeRoles("ADMIN"),category.categoryUpdate);
     app.route('/api/subcategory/add').post(authorizeRoles("ADMIN"),category.subcategoryAdd);
    app.route('/api/subcategory/get/:id').get(authorizeRoles("ADMIN","SELLER"),category.subgetcategory);
     app.route('/api/subcategory/update/:id').get(authorizeRoles("ADMIN"),category.subcategoryUpdate);
}