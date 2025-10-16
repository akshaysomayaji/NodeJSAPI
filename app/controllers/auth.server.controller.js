const { where,Op  } = require("sequelize");
const db = require("../../config/plsql"),crypto = require('crypto');
var NotificationHelper = require('../helpers/genericHelper').commonNotification;
var PasswordHelper = require('../helpers/genericHelper').PasswordHelper;
var jwt = require('jsonwebtoken');
const exp = require("constants");
const { connected } = require("process");
const users = db.userdetails;
const passwordschema = db.UserPasswordDetail;
notification = new NotificationHelper();
_PasswordHelper = new PasswordHelper();

exports.authentication = async function (req, res, next) {
    console.log(req.body);
    users.findOne({ where: { [Op.or]: [{ emailid: req.body.email }, { mobilenumber: req.body.mobilenumber }] } }).then(data => {
        console.log(data);
        const userdetails = data.dataValues;
        passwordschema.findOne({where :{userid:userdetails.userdetailid}}).then(_respomse =>{
            if (!_respomse) {
                return res.send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth004') });
            }else{
                const hashedPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
                if(_respomse.dataValues.password != hashedPassword){
                    return res.send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth004') });
                }
            }

            const tokenObj = {
                    id: userdetails.userdetailid,
                    email: req.body.email,
                    sessionId: req.sessionId,
                    userrole: data.userrole,
                    isManufacutrer: data.is_manufacturer
                };
                const token = jwt.sign(tokenObj, req.config.tokenSecret, { expiresIn: 60 * 60 });
                res.send({
                    users: data,
                    txtFullName: data.fullname,
                    success: true,
                    response_message: '',
                    token,
                    txtRoleName: data.userrole,
                    isSetupCompleted: data.isSetupCompleted
                });
        })
    })
}

exports.register = async function (req, res, next) {
    console.log(req.body);
    var body  = req.body;
    const hashedPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
    users.create(body).then(data => {
      const userdetails = data.dataValues;
        var contet = {
            password : hashedPassword,
            userid : userdetails.userdetailid
        };
        passwordschema.create(contet).then(_data =>{
            const tokenObj = {
                    id: userdetails.userdetailid,
                    email: req.body.email,
                    sessionId: req.sessionId,
                    userrole: data.userrole,
                    isManufacutrer: data.is_manufacturer
                };
                const token = jwt.sign(tokenObj, req.config.tokenSecret, { expiresIn: 60 * 60 });

            return res.send({ users: data, success: true, response_message: notification.getUser_notification_message('User003'),token });
        }).catch(err => {
            res.status(500).send({ users: data, success: false, response_message: notification.getUser_notification_message('User000'), err });
        })        
    })
    .catch(err => {
      res.status(500).send({ users: {}, success: false, response_message: notification.getUser_notification_message('User000'), err });
    });
}

exports.forgotpassword = async function (req, res, next) {
    user.findAll({ where: { emailid: req.body.email } }).then(data => {
        if (data.length  == 1) {
            passwordschema.update({ isPasswordReset: true }, { where: { userid: data.dataValues.userdetailid } }).then(_data => {
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
    const token = req.headers['authorization'];
    jwt.singout(token, req.config.tokenSecret);
    return res.send({ users: [], success: true, response_message: notification.authetication_notification_message('Auth009') });
}
exports.checktoken = async function (req, res, next) {
    const token = req.headers['authorization'];
    jwt.verify(token, req.config.tokenSecret, function (err, decoded) {
        if (decoded.exp <= Date.now() / 1000) {
            return res.send({ users: [], success: true, response_message: notification.authetication_notification_message('Auth010') });
        }
        else {
            return res.send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth011') });
        }
    })
}

exports.resetpassword = async function (req, res, next) {

}

exports.signup = async function (req, res, next){
    var body = req.body;
    users.create(body).then(data => {
        const userdetails = data.dataValues;
        body.password = _PasswordHelper.generatePassowrd("10");
        passwordschema.create({ password: body.password, userid: data.userdetailid }).then(_data => {
            return res.send({ users: data, success: true, response_message: notification.authetication_notification_message('Auth006') });
        }).catch(err => {
            res.status(500).send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth007') });
        }); 
    }).catch(err => {
        res.status(500).send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth007') });
    });
}

exports.validateEmailMobile = async function (req, res, next){
    users.findOne({where: {[Op.or]:[{emailid: req.body.email},{mobilenumber : req.body.mobilenumber}]}}).then(data =>{
        if(data != null){
            return res.send({ users: data, success: false, response_message: notification.authetication_notification_message('Auth012') });
        }
        return res.send({ users: {}, success: true, response_message: "" });
    });
}