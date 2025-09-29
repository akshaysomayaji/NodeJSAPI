const db = require("../../config/plsql"),crypto = require('crypto');
var NotificationHelper = require('../helpers/genericHelper').commonNotification;
const users = db.userdetails;
const password = db.UserPasswordDetail;

exports.register = async function (req, res, next) {
    var body  = req.body;
    const hashedPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
    users.create(body).then(data => {
        var contet = {
            password: hashedPassword,
            userid: data.userdetailid
        }
        password.create(contet).then(_data =>{
            console.log("data "+ _data);
            return res.send({ users: data, success: true, response_message: notification.getUser_notification_message('User003') });
        }).catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the password."
            });
        })        
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
}

exports.getuserdetails = async function (req, res, next){
    const id = req.params.id;
    users.findByPk(id).then(result => {
      if (!result) {
            return res.send({ users: [], success: false, msg: notification.getUser_notification_message('User003') });
        }
        res.send({ users: result, success: true, msg: "" });
    })
    .catch(err => {
      res.status(500).send({ users: {}, success: false, msg: notification.getUser_notification_message('User000'), err });
    });
}

exports.getallusers = async function (req, res, next){
    users.find().then(result => {
      if (!result) {
            return res.send({ users: [], success: false, msg: notification.getUser_notification_message('User003') });
        }
        res.send({ users: result, success: true, msg: "" });
    })
    .catch(err => {
      res.status(500).send({ users: {}, success: false, msg: notification.getUser_notification_message('User000'), err });
    });
}
