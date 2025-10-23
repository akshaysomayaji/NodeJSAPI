var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    flash = require('connect-flash'),
    //session = require('express-session'),
    //mongoStore = require('connect-mongo')(session)
    expressJWT = require('express-jwt'),
    jwt = require('jsonwebtoken'),
    cors = require('cors'),
    uuid = require('node-uuid'),
    cookieParser = require('cookie-parser'),
    boolParser = require('express-query-boolean'),
    dateParser = require('express-query-date'),
    swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUi = require("swagger-ui-express");
    const swaggerDocs = require("../app/helpers/swaggerhelper.js");

module.exports = function () {
    var app = express();
    app.use(/(.*)/, cookieParser('SecretPassPhrase'));
    app.use(/(.*)/, bodyParser.urlencoded({
        extended: true
    }));
    swaggerDocs(app);
    app.use(/(.*)/, bodyParser.json({ limit: '50mb' }));
    app.use(/(.*)/, boolParser());
    //app.use(/(.*)/, dateParser());
    var corsOptions = {
        origin: config.domain,
        credentials: false,
        optionsSuccessStatus: 200
    };
    app.use(/(.*)/, cors(corsOptions));
    app.options(/(.*)/, cors(corsOptions));
    app.use(/(.*)/, function (req, res, next) {
        // Assign the config to the req object
        req.config = config;
        return next();
    });

    app.use('/*\w', function (req, res, next) {
        const excludedPaths = ['/api/login', '/api/user/authenticate', '/api/user/add','/api/register', '/api/index', '/'];
        if (!excludedPaths.includes(req.baseUrl)) {
            const token = req.headers['authorization'];
            if (!token) {
                return res.status(403).send({ success: false, id: 102, msg: 'no token provided.' });
            }
            try {
                const decoded = jwt.verify(token, config.tokenSecret);
                if (decoded.exp <= Date.now() / 1000) {
                    return res.status(403).send({ success: false, id: 102, msg: 'Session expired. Please relogin.' });
                }
                req.decoded = decoded;
                next();
            } catch (err) {
                return res.status(403).send({ success: false, id: 101, msg: 'Invalid Token. Please relogin' });
            }
        } else {
            next();
        }
    });

    require('../app/routes/users.server.routes.js')(app);
    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/auth.server.routes.js')(app);
    require('../app/routes/category.server.routes.js')(app);
    require('../app/routes/business.server.routes.js')(app);
    require('../app/routes/maindashboard.server.routes.js')(app);
    require('../app/routes/product.server.routes')(app);
    require('../app/routes/order.server.routes')(app);
    return app;
};