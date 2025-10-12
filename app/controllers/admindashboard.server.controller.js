const { where,Op  } = require("sequelize");
const db = require("../../config/plsql");
const users = db.userdetails;
const productdetails = db.productDetails;
const admindashboardresponse = {
    buyyers: {
        totalcount: 0,
        activeusers: 0,
        pendingverification: 0
    },
    sellers: {
        totalcount: 0,
        activeusers: 0,
        kycpendingverification: 0
    },
    manufactures: {
        totalcount: 0,
        activeusers: 0,
        newproductssubmitted: 0
    },
    buyyers_recent_orders: {},
    sellers_recent_orders: {},
    sellers_unverified: {},
}

exports.getdashboardcontent = async function(req, res, next){
    getBuyyerDetails();
    getSellerDetails();
    getSellerManufacturerDetails();
    return res.send({ data: admindashboardresponse, success: true, response_message: "Business Detail Added Successfully." });
}

function getBuyyerDetails() {
    users.count({ where: { userrole: 'BUYER', isActive: 'true' } }).then(a => {
        admindashboardresponse.buyyers.totalcount = a;
    }).catch(err => {
        admindashboardresponse.buyyers.totalcount = 0;
    });

    users.count({ where: { userrole: 'BUYER', isActive: true, isApproved: true } }).then(b => {
        admindashboardresponse.buyyers.activeusers = b;
    }).catch(err => {
        admindashboardresponse.buyyers.activeusers = 0;
    });

    users.count({ where: { userrole: 'BUYER', isActive: true, isApproved: false } }).then(c => {
        admindashboardresponse.buyyers.pendingverification = c;
    }).catch(err => {
        admindashboardresponse.buyyers.pendingverification = 0;
    });
}


function getSellerDetails() {
    users.count({ where: { userrole: 'SELLER', isActive: 'true' } }).then(a => {
        admindashboardresponse.sellers.totalcount = a;
    }).catch(err => {
        admindashboardresponse.sellers.totalcount = 0;
    });

    users.count({ where: { userrole: 'SELLER', isActive: true, isApproved: true } }).then(b => {
        admindashboardresponse.sellers.activeusers = b;
    }).catch(err => {
        admindashboardresponse.sellers.activeusers = 0;
    });

    users.count({ where: { userrole: 'SELLER', isActive: true, isApproved: false } }).then(c => {
        admindashboardresponse.sellers.kycpendingverification = c;
    }).catch(err => {
        admindashboardresponse.sellers.kycpendingverification = 0;
    });
}

function getSellerManufacturerDetails() {
    users.count({ where: { userrole: 'SELLER', is_manufacturer:'true', isActive: 'true' } }).then(a => {
        admindashboardresponse.manufactures.totalcount = a;
    }).catch(err => {
        admindashboardresponse.manufactures.totalcount = 0;
    });

    users.count({ where: { userrole: 'SELLER', is_manufacturer: 'true', isActive: true, isApproved: true } }).then(b => {
        admindashboardresponse.manufactures.activeusers = b;
    }).catch(err => {
        admindashboardresponse.manufactures.activeusers = 0;
    });

    productdetails.count({ where: { adminApprovedStatus: 'SUBMITTED', isActive: true, isApproved: false } }).then(c => {
        admindashboardresponse.manufactures.kycpendingverification = c;
    }).catch(err => {
        admindashboardresponse.manufactures.kycpendingverification = 0;
    });
}




