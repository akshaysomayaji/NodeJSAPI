const { where } = require("sequelize");
const db = require("../../config/plsql"),crypto = require('crypto');
var NotificationHelper = require('../helpers/genericHelper').commonNotification;
const users = db.userdetails;
const password = db.UserPasswordDetail;
const notification = new NotificationHelper();

exports.register = async function (req, res, next) {
    var body  = req.body;
    const hashedPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
    users.create(body).then(data => {
      const userdetails = data.dataValues;
        var contet = {
            password : hashedPassword,
            userid : userdetails.userdetailid
        };
        password.create(contet).then(_data =>{
            console.log("data "+ _data);
            return res.send({ users: data, success: true, response_message: notification.getUser_notification_message('User003') });
        }).catch(err => {
            res.status(500).send({ users: data, success: false, msg: notification.getUser_notification_message('User000'), err });
        })        
    })
    .catch(err => {
      res.status(500).send({ users: {}, success: false, msg: notification.getUser_notification_message('User000'), err });
    });
}

exports.getuserdetails = async function (req, res, next){
    const id = req.params.id;
    users.findByPk(id).then(result => {
      if (!result) {
          return res.send({ data: [], success: false, msg: notification.getUser_notification_message('User003') });
        }
        res.send({ data: result, success: true, msg: "" });
    })
    .catch(err => {
        res.status(500).send({ data: {}, success: false, msg: notification.getUser_notification_message('User000'), err });
    });
}

exports.getallusers = async function (req, res, next){
    users.findAll({where :{userrole:"ADMIN"}}).then(result => {
      if (!result) {
            return res.send({ users: [], success: false, msg: notification.getUser_notification_message('User003') });
        }
        res.send({ users: result, success: true, msg: "" });
    })
    .catch(err => {
      res.status(500).send({ users: {}, success: false, msg: notification.getUser_notification_message('User000'), err });
    });
}

exports.approve = async function (req, res, next) {
    users.update({ isActive: true, isApproved: true }, { where: { userdetailid: req.params.id } }).then(result => { 
      if(result[0] == 1){
        return res.send({ users: result, success: true, msg: notification.getUser_notification_message('User004') });
      }else{
        return res.send({ users: result, success: false, msg: notification.getUser_notification_message('User016') });
      }
      
    })
    .catch(err => {
      res.status(500).send({ users: {}, success: false, msg: notification.getUser_notification_message('User000'), err });
    });
}
