var category = require('../../app/controllers/category.server.controller');
module.exports = function (app) {
     app.route('/api/category/add').post(category.categoryAdd);
     app.route('/api/category/get').get(category.getcategory);
     app.route('/api/category/get/:id').get(category.getcategorybyId);
     app.route('/api/category/update/:id').get(category.categoryUpdate);
     app.route('/api/subcategory/add').post(category.subcategoryAdd);
     app.route('/api/subcategory/get/:id').get(category.subgetcategory);
     app.route('/api/subcategory/update/:id').get(category.subcategoryUpdate);
}