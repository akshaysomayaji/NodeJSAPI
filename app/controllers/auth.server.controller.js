const { where } = require("sequelize");
const db = require("../../config/plsql"),crypto = require('crypto');
var NotificationHelper = require('../helpers/genericHelper').commonNotification;
var jwt = require('jsonwebtoken');
const exp = require("constants");
const users = db.userdetails;
const passwordschema = db.UserPasswordDetail;

exports.authentication = async function(req, res, next){
    const { mobile,email,password } = req.body;
    users.findAll({where:{emailid: email}}).then(data =>{
        passwordschema.findAll({where :{userid:data.userdetailid}}).then(_respomse =>{
            if (!_respomse || !_respomse.comparepasswords(password)) {
                return res.send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth004') });
            }

            const tokenObj = {
                    id: data.userdetailid,
                    email: data.emailid,
                    sessionId: req.sessionId,
                    userrole: data.userrole
                };
                const token = jwt.sign(tokenObj, config.tokenSecret, { expiresIn: 60 * 60 });
                res.send({
                    users: data.id,
                    txtFullName: data.fullname,
                    success: true,
                    response_message: '',
                    token,
                    txtRoleName: data.userrole,
                });
        })
    })
}

exports.register = async function (req, res, next) {
    user.findAll({ where: { emailid: req.body.email } }).then(data => {
        if (data.length > 0) {
            return res.send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth005') });
        }
        else {
            var body = req.body;
            users.create(body).then(data => {
                passwordschema.create({ password: body.password, userid: data.userdetailid }).then(_data => {
                    return res.send({ users: data, success: true, response_message: notification.authetication_notification_message('Auth006') });
                }).catch(err => {
                    res.status(500).send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth007') });
                })  
            }).catch(err => {
                res.status(500).send({ users :[], success: false, response_message: notification.authetication_notification_message('Auth007') });
            })
        }
    }).catch(err => {
        res.status(500).send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth007') });
    });
}

exports.forgotpassword = async function (req, res, next) {
    user.findAll({ where: { emailid: req.body.email } }).then(data => {
        if (data.length  == 1) {
            passwordschema.update({ isPasswordReset: true }, { where: { userid: data.userdetailid } }).then(_data => {
                return res.send({ users: data, success: true, response_message: notification.authetication_notification_message('Auth006') });
            }).catch(err => {
                res.status(500).send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth007') });
            });
        }
        else {
            res.status(200).send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth008') });
        }
    }).catch(err => {
        res.status(500).send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth007') });
    });;
}

exports.logout = async function (req, res, next) {
    const token = req.body.token;
    jwt.singout(token, req.config.tokenSecret);
    return res.send({ users: [], success: true, response_message: notification.authetication_notification_message('Auth009') });
}
exports.checktoken = async function (req, res, next) {
    const token = req.body.token;
    jwt.verify(token, req.config.tokenSecret, function (err, decoded) {
        if (decoded) {
            return res.send({ users: [], success: true, response_message: notification.authetication_notification_message('Auth010') });
        }
        else {
            return res.send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth011') });
        }
    })
}

exports.resetpassword = async function (req, res, next) {

}