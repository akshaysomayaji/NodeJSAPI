const { where,Op  } = require("sequelize");
const db = require("../../config/plsql");
const orders = db.orders;
const orderedItems = db.orderedItems;
const cartDetails = db.cartDetails;
const cartProductDetails = db.cartProductDetails;

exports.orderProduct = async function (req, res, next) {
    cartProductDetails.find({ where: { cartId: req.body.cartId, userId: req.decoded.id, isActive: true } }).then(response => {
        if (response) {
            const object = {
                userId: req.decoded.id,
            }
            orders.create(object).then(result => {
                if (result) {
                    const cartProducts = [];
                    const data = response.dataValues;
                    data.forEach((i) => {
                        cartProducts.push({
                            userId: i.buyyerId,
                            sellerId: i.sellerId,
                            productId: i.cartProductId,
                            quantity: i.quantity,
                            price: i.price,
                            gst: i.gst,
                            discount: i.discount,
                            finalPrice: i.finalPrice,
                            orderId: result.dataValues.orderId
                        })
                    });
                    orderedItems.create(data).then(result1 => {
                        if (result1) {
                            cartDetails.update({ cartStatus: 'CHECKED_OUT' }, { where: { cartId: req.body.cartId, userId: req.decoded.id, isActive: true } }).then(response1 => {
                                if (response1) {
                                    return res.send({ data: response1, success: true, response_message: "Product Ordered Successfully." });
                                }
                            })
                        }
                    }).catch(err => {
                        res.status(500).send({ data: [], success: false, response_message: err.message });
                    })
                }
            }).catch(err => {
                res.status(500).send({ data: [], success: false, response_message: err.message });
            });
        }
    });
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