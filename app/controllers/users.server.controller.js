var mongoose = require('mongoose'), crypto = require('crypto'), User = mongoose.model('UserSchema'), UserPassword = mongoose.model('UserPasswordSchema'), user_otp_schema = mongoose.model('user_otp_schema');
var userLoginLogSchema = mongoose.model('UserLoggedInLogSchema');
var NotificationHelper = require('../helpers/genericHelper').commonNotification;
var MailHelper = require('../helpers/genericHelper').mailgeneraation;
notification = new NotificationHelper();
mail = new MailHelper();
var jwt = require('jsonwebtoken');
var config = require('../../config/config');


exports.authenticate = async function (req, res, next) {
    const { mobile,email, password } = req.body;
    var user = await User.findOne({ $or: [{ mobilenumber: mobile }, { email: email }], isActive: true });
    if (!user) {
        return res.send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth005') });
    }
    const userPassword = await UserPassword.findOne({ userid: user._id.toString(), isActive: true });
    if (!userPassword || !userPassword.comparepasswords(password)) {
        return res.send({ users: [], success: false, response_message: notification.authetication_notification_message('Auth004') });
    }
    await userLoginLogSchema.updateMany({ txtUserId: user._id }, { isOnline: false, isActive: false, dtLoggedOut: Date.now() });
    const userLoginLogSchemaObj = new userLoginLogSchema();
    userLoginLogSchemaObj.txtUserId = user._id;
    userLoginLogSchemaObj.isOnline = true;
    await userLoginLogSchemaObj.save();
    const tokenObj = {
        id: user._id,
        email: user.email,
        sessionId: req.sessionId,
        userrole: user.userrole
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
}

exports.register = async function (req, res, next) {
    try {
        const userInput = req.body;
        const user = new User({ ...userInput, userrole: 'admin' });
        const savedUser = await user.save();
        const hashedPassword = crypto.createHash('md5').update(userInput.password).digest('hex');
        console.log(hashedPassword);
        const userPassword = new UserPassword({ ...userInput, password: hashedPassword, userid: savedUser._id.toString() });
        await userPassword.save();
        res.send({ users: [], success: true, msg: notification.getUser_notification_message('User004') });
    } catch (err) {
        res.send({ users: [], success: false, msg: notification.getUser_notification_message('User000'), err });
    }
}

exports.forgotpassword = function (req, res, next) {
    try {
        user_otp_schema.findOne({ email: req.params.email, isActive: true }, function (err, result) {
            if (err) {
                res.send({ 'users': [], success: false, msg: notification.getUser_notification_message('User014'), err: err });
            } else {
                if (result) {
                    res.send({ 'users': [], success: false, msg: notification.getUser_notification_message('User003'), err: err });
                } else {
                    res.send({ 'users': [], success: true, msg: notification.getUser_notification_message('User003') });
                }
            }
        })
    } catch (err) {
        res.send({ 'users': [], success: false, msg: notification.getUser_notification_message('Us000'), err: err });
    }
}

function sendmails(body, req, callback) {
    var smtp = req.config.smtp;
}

exports.validateSession = function (req, res, next) {
    try {
        console.log("id =", req.session.userid);
        User.findOne({ _id: mongoose.Types.ObjectId(req.session.userid), isActive: true }, function (err, result) {
            if (err) {
                res.send({ 'users': [], success: false, msg: notification.getUser_notification_message('User000'), err: err });
            } else {
                if (result) {
                    res.send({ success: true, msg: "", });
                } else {
                    res.send({ success: false, msg: "Session expired. Please relogin." });
                }
            }
        });
    }
    catch (err) {
        res.send({ success: false, text: "Session expired. Please relogin.", });
    }

};

exports.getuserdetails = async (req, res, next) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;
        const result = await User.findOne({ _id: new ObjectId(req.params.id), isActive: true });
        if (!result) {
            return res.send({ users: [], success: false, msg: notification.getUser_notification_message('User003') });
        }
        res.send({ users: result, success: true, msg: "" });
    } catch (err) {
        res.send({ users: {}, success: false, msg: notification.getUser_notification_message('User000'), err });
    }
}

exports.getallusers = async function (req, res, next) {
    const params = req.query;
    const query = { isActive: true, ...Object.fromEntries(Object.entries(params).filter(([key, value]) => value)) };
    try {
        const users = await User.find(query);
        res.send({ users, success: !!users, msg: users ? "" : notification.getUser_notification_message('User003') });
    } catch (err) {
        res.send({ users: {}, success: false, msg: notification.getUser_notification_message('User000'), err });
    }
}

exports.adduser = async function (req, res, next) {
    try {
        const user = await User.findOne({ $or: [{ mobilenumber: req.body.mobilenumber }, { email: req.body.email }], isActive: true });
        if (user) {
            res.send({ 'users': [], success: false, msg: notification.getUser_notification_message('User000'), err: err });
        }
        var userObj = new User(req.body);
        const savedUser = await userObj.save();
        const hashedPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
        console.log(hashedPassword);
        const userPassword = new UserPassword({ ...req.body, password: hashedPassword, userid: savedUser._id.toString() });
        await userPassword.save();
        res.send({ 'users': [], success: true, msg: notification.getUser_notification_message('User004') });
    }
    catch (err) {
        res.send({ 'users': [], success: false, msg: notification.getUser_notification_message('User000'), err: err });
    }
}

exports.getOnlineUsers = function (req, res, next) {
    try {
        userLoginLogSchema.aggregate([{
            $lookup: {
                from: "User",
                localField: "txtUserId",
                foreignField: "_id",
                as: "userdocs"
            }
        },
        { $project: { "User.username": 1, "isOnline": 1 } }
        ], function (err, response) {
        });
    } catch (err) {
        res.send({ 'users': [], success: false, msg: notification.getUser_notification_message('User000'), err: err });
    }
}

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.send({ users: [], success: true, msg: notification.getUser_notification_message('User004') });
    } catch (err) {
        res.send({ users: [], success: false, msg: notification.getUser_notification_message('User000'), err });
    }
}

exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
        res.send({ users: [], success: true, msg: notification.getUser_notification_message('User004') });
    } catch (err) {
        res.send({ users: [], success: false, msg: notification.getUser_notification_message('User000'), err });
    }
}