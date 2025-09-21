module.exports = function (app) {
    app.route('/api/index').get(function (req, res) {
        res.json({ message: 'Welcome to Invoice Services : ' + new Date().toString() });
    });

    app.route('/').get(function (req, res) {
        res.json({ message: 'Welcome to Invoice Services: ' + new Date().toString() });
    });
};