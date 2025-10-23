const { where,Op  } = require("sequelize");
const db = require("../../config/plsql");
const orders = db.orders;
const orderedItems = db.orderedItems;
const cartDetails = db.cartDetails;
const cartProductDetails = db.cartProductDetails;

exports.orderProduct = async function (req, res, next) {
    orders.count().then(total => {
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const sequence = String(total + 1).padStart(4, "0");
        const _id = `ORD-${datePart}-${sequence}`; 
        cartProductDetails.findAll({ where: { cartId: req.body.cartId, userId: req.decoded.id, isActive: true } }).then(response => {
            if (response) {
                const object = {
                    userId: req.decoded.id,
                    orderId: _id
                }
                orders.create(object).then(result => {
                    if (result) {
                        const cartProducts = [];
  
                        const data = response;
                        data.forEach((j) => {
                            const i = j.dataValues;
                            console.log(i);
                            cartProducts.push({
                                buyyerId: req.decoded.id,
                                sellerId: i.sellerId,
                                cartProductId: i.cartProductId,
                                quantity: i.quantity,
                                price: i.price,
                                gst: i.gst,
                                discount: i.discount,
                                totalPrice: i.finalPrice,
                                finalPrice: i.finalPrice,
                                orderId: result.dataValues.orderId
                            })
                        });
                        orderedItems.bulkCreate(cartProducts).then(result1 => {
                            console.log(result1);
                            if (result1) {
                                cartDetails.update({ cartStatus: 'CHECKED_OUT' }, { where: { cartId: req.body.cartId, userId: req.decoded.id, isActive: true } }).then(response1 => {
                                    if (response1) {
                                        return res.send({ data: response1, success: true, response_message: "Product Ordered Successfully." });
                                    }
                                })
                            }
                        }).catch(err => {
                            console.log(err);
                            res.status(500).send({ data: [], success: false, response_message: err.message });
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    res.status(500).send({ data: [], success: false, response_message: err.message });
                });
            }
        });
    })
    
}

exports.update = async function (req, res, next) {
    req.body.paymentStatus = req.body.paymentStatus.toLowerCase() == "paid" ? "PAID" : "UNPAID";
    orders.update({ paymentStatus: req.body.paymentStatus }, { where: { orderId: req.body.orderId } }).then(result => {
        if (result) {
            orderedItems.update({ paymentStatus: req.body.paymentStatus }, { where: { orderId: req.body.orderId } }).then(result1 => {
                if (result1) {
                    return res.send({ data: result1, success: true, response_message: "Order Updated Successfully." });
                }
            }).catch(err => {
                res.status(500).send({ data: [], success: false, response_message: err.message });
            })
        }
    }).catch(err => {
        res.status(500).send({ data: [], success: false, response_message: err.message });
    })
}

exports.getorders = async function (req, res, next) {
    var condtion = { where: { sellerId: req.decoded.id, paymentStatus: 'PAID', status: 'Ordered' } };
    if (req.decoded.userrole == 'BUYYER') {
        condtion = { where: { buyyerId: req.decoded.id, paymentStatus: 'PAID', status: 'Ordered' } };
    }
    orderedItems.findAll(condtion).then(respose => {
        return res.send({ data: respose, success: true, response_message: "" });
    }).catch(err => {
        return res.send({ data: [], success: true, response_message: err.message });
    })
}

async function getOrderId() {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const sequence = String(0 + 1).padStart(4, "0");
    return `ORD-${datePart}-${sequence}`    
}