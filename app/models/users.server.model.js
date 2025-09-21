var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: { type: String },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: false
    },
    isActive: {
        type: Boolean, default: true,
        required: true
    },
    createdDate: {
        type: Date, default: Date.now(),
        required: true
    }, userrole: {
        type: String,
        required: true
    }
}, { collection: "users" });


var UserPasswordSchema = new Schema({
    password: {
        type: String, match: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*~`&quot;;(){}^+-=<>#|\,''_?&.]{8,}/,
        required: true
    },
    userid: {
        type: String,
        required: false
    },
    changePassword: {
        type: Boolean, default: false,
        required: true
    },
    isActive: {
        type: Boolean, default: true,
        required: true
    },
    createdDate: {
        type: Date, default: Date.now(),
        required: true
    },
}, { collection: "usersPassword" });




UserPasswordSchema.methods.comparepasswords = function (password) {
    var md5 = crypto.createHash('md5');
    md5 = md5.update(password).digest('hex');
    return this.password === md5;
};

var user_otp_schema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true
    },
    isActive: {
        type: Boolean, default: true,
        required: true
    },
    createdDate: {
        type: Date, default: Date.now(),
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
}, { collection: "user_otp" });


var userRolesSchema = new Schema({
    rolename: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean, default: true,
        required: true
    },
    createdDate: {
        type: Date, default: Date.now(),
        required: true
    }
}, { collection: "userroles" });


var user_login_log = new Schema({
    dtLoggedIn: {
        type: Date, default: Date.now(),
        required: true
    },
    isOnline: {
        type: Boolean, default: false,
        required: true
    },
    dtLoggedOut: {
        type: Date, default: Date.now(),
        required: true
    },
    ipAddress: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean, default: true
    },
    txtUserId: {
        type: String,
        required: true
    }
}, { collection: "userloggedinlogs" });



mongoose.model('UserSchema', UserSchema);
mongoose.model('UserPasswordSchema', UserPasswordSchema);
mongoose.model('user_otp_schema', user_otp_schema);
mongoose.model('userRolesSchema', userRolesSchema);
mongoose.model('UserLoggedInLogSchema', user_login_log);\