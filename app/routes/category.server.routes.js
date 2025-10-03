var category = require('../../app/controllers/category.server.controller');
const { authenticate, authorizeRoles } = require("../helpers/authorizationHelper");
module.exports = function (app) {
     app.route('/api/category/add').post(authorizeRoles("admin"),category.categoryAdd);
     app.route('/api/category/get').get(authorizeRoles("admin"),category.getcategory);
     app.route('/api/category/get/:id').get(authorizeRoles("admin"),category.getcategorybyId);
     app.route('/api/category/update/:id').get(authorizeRoles("admin"),category.categoryUpdate);
     app.route('/api/subcategory/add').post(authorizeRoles("admin"),category.subcategoryAdd);
     app.route('/api/subcategory/get/:id').get(authorizeRoles("admin"),category.subgetcategory);
     app.route('/api/subcategory/update/:id').get(authorizeRoles("admin"),category.subcategoryUpdate);
}