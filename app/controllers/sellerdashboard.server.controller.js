const { where, Op } = require("sequelize");
const db = require("../../config/plsql");
const users = db.userdetails;
const productdetails = db.productDetails;
const admindashboardresponse = {
    loggedInUserName: {
        fullName: '',
        pan: '',
        balance: '',
    },
    totalProducts: 0,
    ordersToday: 0,
    ordersDelivered: 0,
    ordersReturned: 0,
    recentOrder: null,
    topSellingProducts: null
};

exports.getdashboardcontent = async function (req, res, next) {

}

function getUserDetails() {
    const id = req.decoded.id;
    users.findByPk(id).then(result => {
        if (!result) {
            const userdetails = result.dataValues;
            admindashboardresponse.loggedInUserName.fullName = userdetails.fullname;
            admindashboardresponse.loggedInUserName.pan = userdetails.fullname;
        res.send({ data: result, success: true, msg: "" });
    })
        .catch(err => {
            res.status(500).send({ data: {}, success: false, msg: notification.getUser_notification_message('User000'), err });
        });
}