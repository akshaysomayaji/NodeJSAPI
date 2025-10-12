const { where,Op  } = require("sequelize");
const db = require("../../config/plsql");
const productdetails = db.productdetails;
const productImagedetails = db.productImagedetails;
const producttagsdetails = db.producttagsdetails;
const cartDetails = db.cartDetails;
exports.addProduct = async function (req, res, next) {
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
        createdUser: req.body.userId
    }
    productdetails.create(content).then(data =>{
        var images = [];
        req.body.images.forEach((element) => {
            var image = {
                productId : data.dataValues.productId,
                imageContent: element.imageContent,
                imageFileMimeType: element.imageFileMimeType,
                imageName: element.imageName,
                imageType: element.imageType,
                selectedImage: element.selectedImage
            }
            images.insert(image);
        });
        productImagedetails.create(images).then(res =>{
            var tags = [];
            req.body.tags.forEach((element) =>{
                var tag = {
                    tagId : req.body.tagid,
                    productId : data.dataValues.productId,
                }
                tags.insert(tag);
            })
            producttagsdetails.create(tags).then(re =>{
                return res.send({ businessdetails: data, success: true, response_message: "Business Detail Added Successfully." });
            }).catch(err=>{
                res.status(500).send({ businessdetails: {}, success: false, msg: err.message });
            });            
        }).catch(err=>{
            res.status(500).send({ businessdetails: {}, success: false, msg: err.message });
        });
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
        userId: req.body.userId
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
    productdetails.findOne({ where: { productId: req.params.id } }).then(data => {
        return res.send({ data: data, success: true, response_message: "" });
    }).catch(err => {
        res.status(500).send({ data: [], success: false, response_message: err.message });
    });
}

exports.getproductdetails = async function (req, res, next) {
    productdetails.findAll({ where: { [Op.or]: [{ productName: req.body.productName }, { sku: req.body.sku },{categoryId : req.body.categoryId},{lowStockAlert : req.body.lowStockAlert},{productStatus : req.body.productStatus}]}}).then(data =>{
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

exports.addtocart = async function (req, res, next) {
    cartDetails.findOne({ where: { productId: req.body.productId, userId: req.body.userId } }).then(data => {
        if (data != null) {
            data.dataValues.quantity = data.dataValues.quantity + 1;
            data.dataValues.price = req.body.price;
            data.dataValues.totalPrice = data.dataValues.quantity * req.body.price;
            cartDetails.update(data.dataValues, { where: { productId: req.body.productId, userId: req.body.userId } }).then(result => {
                return res.send({ data: result, success: true, response_message: "Product Added To Cart Successfully." });
            }).catch(err => {
                res.status(500).send({ data: [], success: false, response_message: err.message });
            });
        } else {
            cartDetails.create(req.body).then(data => {
                return res.send({ data: data, success: true, response_message: "Product Added To Cart Successfully." });
            }).catch(err => {
                res.status(500).send({ data: [], success: false, response_message: err.message });
            });
        }
    }).catch(err => {
        res.status(500).send({ data: [], success: false, response_message: err.message });
    });
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
