const { where } = require("sequelize");
const db = require("../../config/plsql"),crypto = require('crypto');
var NotificationHelper = require('../helpers/genericHelper').commonNotification;
var jwt = require('jsonwebtoken');
const users = db.userdetails;
const passwordschema = db.UserPasswordDetail;

exports.authentication = async function(req, res, next){
    const { mobile,email,password } = req.body;
    console.log(email);
    console.log(password);
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
                    users: user._id,
                    txtFullName: user.fullname,
                    success: true,
                    response_message: '',
                    token,
                    txtRoleName: user.txtRoleName,
                });
        })
    })
}