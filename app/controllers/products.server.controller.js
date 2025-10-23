const { where,Op  } = require("sequelize");
const db = require("../../config/plsql");
const productdetails = db.productDetails;
const productImagedetails = db.productImagedetails;
const producttagsdetails = db.productTags;
const cartdetails = db.cartDetails;
const cartProductDetails = db.cartProductDetails;
const tags = db.tags;
exports.addProduct = async function (req, res, next) {
    console.log(req.body);
    const content = {
        productName: req.body.productName,
        sku: req.body.sku,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        discountPrice: req.body.discountPrice,
        stockQuantity: req.body.stockQuantity,
        lowStockAlert: req.body.lowStockAlert,
        categoryId: req.body.categoryId,
        subcategoryId: req.body.subcategoryId,
        brandName: req.body.brandName,
        productStatus: req.body.productStatus,
        createdUser: req.decoded.id,
        lowStockUnits: req.body.lowStockUnits
    };
    productdetails.create(content).then(data => {
        if (req.body.productImage != null) {
            var images = [];
            req.body.images.forEach((element) => {
                var image = {
                    productId: data.dataValues.productId,
                    imageContent: element.imageContent,
                    imageFileMimeType: element.imageFileMimeType,
                    imageName: element.imageName,
                    imageType: element.imageType,
                    selectedImage: element.selectedImage
                }
                images.insert(image);
            });
            productImagedetails.create(images).then(res => {
                next();
            }).catch(err => {
                res.status(500).send({ businessdetails: {}, success: false, msg: err.message });
            });
        } else {
            const tags = req.body.tags.map((element) => ({
                tagid: element,
                productId: data.dataValues.productId,
            }));
            producttagsdetails.bulkCreate(tags).then(re => {
                return res.send({ businessdetails: re, success: true, response_message: "Business Detail Added Successfully." });
            }).catch(err => {
                res.status(500).send({ businessdetails: {}, success: false, msg: err.message });
            }); 
        }        
    }).catch(err=>{
        res.status(500).send({ businessdetails: {}, success: false, msg: err.message });
    });
}

exports.update = async function (req, res, next) {
    const content = {
        productName : req.body.productName,
        sku: req.body.sku,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        discountPrice: req.body.discountPrice,
        stockQuantity: req.body.stockQuantity,
        lowStockAlert: req.body.lowStockAlert,
        categoryId: req.body.categoryId,
        subcategoryId: req.body.subcategoryId,
        brandName: req.body.brandName,
        productStatus: req.body.productStatus,
        userId: req.body.userId,
        lowStockUnits: req.body.lowStockUnits
    }
    productdetails.update(content,{where :{ productId: req.params.id}}).then(result => { 
        if(result != null){
            return res.send({ data: result, success: true, response_message: "Product is updated." });
        }
    }).catch(error => {
        res.status(500).send({ data: [], success: false, response_message: err.message });
    });;
}

exports.getproduct = async function (req, res, next) {    
    productdetails.findOne({ where: condition }).then(data => {
        return res.send({ data: data, success: true, response_message: "" });
    }).catch(err => {
        res.status(500).send({ data: [], success: false, response_message: err.message });
    });
}

exports.getproductdetails = async function (req, res, next) {
    //const condition = { [Op.or]: [{ productName: req.body.productName }, { sku: req.body.sku },{categoryId : req.body.categoryId},{lowStockAlert : req.body.lowStockAlert},{productStatus : req.body.productStatus}]};
    //if(req.decoded.isManufacutrer){
    //    condition = { where: { [Op.and]: [ { createdUser: req.decoded.id },{[Op.or]: [{ productName: req.body.productName },{sku: req.body.sku },{categoryId : req.body.categoryId},{lowStockAlert : req.body.lowStockAlert},{productStatus : req.body.productStatus}]}]}}
    //}
    productdetails.findAll().then(data => {
        console.log(data);
        return res.send({ data: data, success: true, response_message: "" });
    }).catch(err => {
        res.status(500).send({ data: [], success: false, response_message: err.message });
    });;
}

exports.delete = async function (req, res, next) {
    productdetails.update({ isActive: 0 }, { where: { productId: req.params.id } }).then(result => {
        if (result != null) {
            return res.send({ data: result, success: true, response_message: "Product Deleted Successfully." });
        }
        return res.send({ data: result, success: false, response_message: "Product Not Deleted." });
    }).catch(err => {
        res.status(500).send({ data: [], success: false, response_message: err.message });
    });
}

exports.searchproduct = async function (req, res, next) {
    productdetails.findOne({ where: { [Op.or]: [{ [Op.and]: [{ categoryId: req.body.categoryId }, { subcategoryId: req.params.subcategoryid }] }, { isActive: 1 }] } }).then(data => {
        return res.send({ data: data, success: true, response_message: "" });
    }).catch(err => {
        res.status(500).send({ data: [], success: false, response_message: err.message });
    });;
}

exports.addtocart = async function (req, res, next) 
{
    console.log(req.body);
    productdetails.findOne({ where: { productId: req.body.productId } }).then(productResponse => {
        if (productResponse.dataValues) {
            const productResult = productResponse.dataValues;
           
            const finalPrice = (productResult.productPrice * req.body.quantity) + productResult.gst - productResult.discountPrice;
            console.log(finalPrice);
            const cartProductrequest = {
                userId: req.decoded.id,
                sellerId: productResult.createdUser,
                productId: productResult.productId,
                quantity: req.body.quantity,
                price: productResult.productPrice,
                gst: 1,
                discount: productResult.discountPrice,
                finalPrice: finalPrice,
                cartId: ''
            }
            const cartRequest = {
                userId: req.decoded.id,
                totalAmount: finalPrice,
                discount: productResult.discountPrice,
                shippingCharge: productResult.shippingCharge,
                finalPrice: finalPrice - productResult.discountPrice + productResult.shippingCharge,
            }
            console.log(cartProductrequest);
            console.log(cartRequest);

            cartdetails.findOne({ where: { userId: req.decoded.id, cartStatus: 'CHECKED_IN', isActive: true } }).then(response => {
                
                if (response) {
                    const cartID = response.dataValues.cartId;
                    console.log(cartID);
                    cartProductDetails.findOne({ where: { cartId: cartID, productId: req.body.productId, userId: req.decoded.id, isActive: true } }).then(result => {
                        console.log(result);
                        if (result) {
                            const data = result.dataValues;
                            data.quantity = data.quantity + req.body.quantity;
                            data.discount = productResult.discountPrice;
                            data.price = productResult.productPrice;
                            data.finalPrice = data.quantity * finalPrice;
                            response.dataValues.totalAmount = data.finalPrice;
                            response.dataValues.finalPrice = data.finalPrice + productResult.shippingCharge;
                            cartProductDetails.update(data, { where: { cartId: cartID, productId: req.body.productId, userId: req.decoded.id, isActive: true } }).then(result1 => {
                                if (result1) {
                                    cartdetails.update(response.dataValues, { where: { userId: req.decoded.id, cartStatus: 'CHECKED_IN', isActive: true } }).then(result3 => {
                                        if (result3) {
                                            return res.send({ data: result1, success: true, response_message: "Product Added To Cart Successfully." });
                                        }
                                    }).catch(err => {
                                        res.status(500).send({ data: [], success: false, response_message: err.message });
                                    })                                    
                                }
                            }).catch(err => {
                                res.status(500).send({ data: [], success: false, response_message: err.message });
                            })
                        } else {
                            cartProductrequest.cartId = cartID;
                            cartProductDetails.create(cartProductrequest).then(result2 => {
                                if (result2) {
                                    return res.send({ data: result1, success: true, response_message: "Product Added To Cart Successfully." });
                                }
                            }).catch(err => {
                                res.status(500).send({ data: [], success: false, response_message: err.message });
                            })
                        }
                    }).catch(err => {
                        res.status(500).send({ data: [], success: false, response_message: err.message });
                    })
                } else {
                    cartdetails.create(cartRequest).then(response => {
                        if (response) {
                            cartProductrequest.cartId = response.dataValues.cartId;
                            cartProductDetails.create(cartProductrequest).then(result3 => {
                                if (result3) {
                                    return res.send({ data: result3, success: true, response_message: "Product Added To Cart Successfully." });
                                }
                            }).catch(err => {
                                res.status(500).send({ data: [], success: false, response_message: err.message });
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                        res.status(500).send({ data: [], success: false, response_message: err.message });
                    });
                }
            });
        }
    })
    
}

exports.updateproductstatus = async function (res, res, next) {
    productdetails.update({
        adminApprovedStatus: req.body.status,
        adminId: req.decoded.id
    }).then(result => {
        return res.send({data: result, success: true, response_message: "Product is " + req.body.status + "." });
    }).catch(error => {
        res.status(500).send({ data: [], success: false, response_message: err.message });
    });
}

exports.search = async function (req,res,next) {
    productdetails.findAll({
    attributes: [],
    where: { [Op.or]: [{ [Op.and]: [{ categoryId: req.params.categoryId }, { subcategoryId: req.params.subcategoryid }] }, { isActive: 1 }] },
    include: [
        {
        model: productImagedetails,
        attributes: [],
        required: false, // LEFT JOIN
        include: [
            {
            model: producttagsdetails,
            attributes: [],
            required: false // LEFT JOIN again
            }
        ]
        }
    ]
    }).then(data => {
        return res.send({ data: data, success: true, response_message: "" });
    }).catch(err => {
        res.status(500).send({ data: [], success: false, response_message: err.message });
    });
}


exports.addTag = async function (req, res, next) {
    console.log(tags);
    tags.create(req.body).then(ress => {
        return res.send({ data: ress, success: true, response_message: "Tag Added." });
    }).catch(err => {
        res.status(500).send({ data: [], success: false, response_message: err.message });
    })
}

exports.getTag = async function (req, res, next) {
    tags.findAll().then(ress => {
        return res.send({ data: ress, success: true, response_message: "Tag Added." });
    }).catch(err => {
        return res.status(500).send({ data: [], success: false, response_message: err.message });
    })
}