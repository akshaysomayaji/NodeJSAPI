const { where, Op } = require("sequelize");
const db = require("../../config/plsql");
const users = db.userdetails;
const productdetails = db.productDetails;
const orderedItems = db.orderedItems;
const businessDetails = db.businessDetails;
const sellerdashboardresponse = {
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
    const id = req.decoded.id;
    getContent(id);
    getUserDetails(id);
    return res.send({ data: sellerdashboardresponse, success: true, response_message: "" });
}

function getUserDetails(id) {

    users.findByPk(id).then(result => {
        if (result) {
            console.log(result.dataValues);
            const userdetails = result.dataValues;
            sellerdashboardresponse.loggedInUserName.fullName = userdetails.emailid;
            
        }
    }).catch(err => {
        sellerdashboardresponse.loggedInUserName.fullName = "";
    });

    businessDetails.findOne({ userId: id, isActive: true }).then(response => {
        sellerdashboardresponse.loggedInUserName.pan = response.dataValues.pan;
    }).catch(err => {
        sellerdashboardresponse.loggedInUserName.pan = "";
    });
}

function getContent(id) {
    productdetails.count({ where: { createdUser: id, isActive: true } }).then(res => {
        sellerdashboardresponse.totalProducts = res;
    }).catch(err => {
        sellerdashboardresponse.totalProducts = 0;
    });

    var condtion = { where: { sellerId: id, paymentStatus: 'PAID', status: 'Ordered' } };
    orderedItems.count(condtion).then(respose => {
        sellerdashboardresponse.totalProducts = respose;
    }).catch(err => {
        sellerdashboardresponse.totalProducts = 0;
    })

    var condtion = { where: { sellerId: id, paymentStatus: 'PAID', status: 'Delivered' } };
    orderedItems.count(condtion).then(respose => {
        sellerdashboardresponse.ordersDelivered = respose;
    }).catch(err => {
        sellerdashboardresponse.ordersDelivered = 0;
    })

    var condtion = { where: { sellerId: id, paymentStatus: 'PAID', status: 'Returned' } };
    orderedItems.count(condtion).then(respose => {
        sellerdashboardresponse.ordersReturned = respose;
    }).catch(err => {
        sellerdashboardresponse.ordersReturned = 0;
    })
}