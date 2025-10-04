const { where,Op  } = require("sequelize");
const db = require("../../config/plsql");
const productdetails = db.productdetails;
const productImagedetails = db.productImagedetails;
const producttagsdetails = db.producttagsdetails;
exports.addProduct = async function name(req, res, next) {
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
        userId: req.decoded.id
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