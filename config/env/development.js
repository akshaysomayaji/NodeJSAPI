var port = 1001;
var tokenSecret = 'SuperSecret';
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var domain = 'http://localhost:5173';
var serverUrl = 'http://localhost'

var smtpTransport = nodemailer.createTransport(smtpTransport({
    host: "smtp.gmail.com",
    secureConnection: false,
    port: 587,
    auth: {
        user: "************8@**********.com",
        pass: "*******"
    }
}));

var clientConfigObj = {
    url: serverUrl,
    name: "GSTSTAR",
    email: "messenger@gststar.com",             // for sending email
    image: serverUrl + 'img/logo.png'  // this file present in client project
};

var sessiontimeout = 15 * 60;

module.exports = {
    port: port,
    db: 'mongodb://localhost/MMHDB',
    secret: 'superawesome',
    tokenSecret: tokenSecret,
    smtp: smtpTransport,
    domain: domain,
    serverUrl: serverUrl,
    clientConfigObj: clientConfigObj,
    sessiondb: 'mongodb://localhost/SessionDb',
    sessiontimeout: sessiontimeout,
    database: 'MMHDB',
    username: 'postgres',
    password: '123456',
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}