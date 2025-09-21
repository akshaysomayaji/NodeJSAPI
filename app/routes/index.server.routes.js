var index = require('../../app/controllers/index.server.controller');
module.exports = function (app) {
    app.route('/api/index').get(index.index);

    app.route('/').get(index.index);
};