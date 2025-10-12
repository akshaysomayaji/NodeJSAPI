const { where,Op  } = require("sequelize");
const db = require("../../config/plsql");
const businessDetails = db.businessDetails;
const users = db.userdetails;
exports.addBusinessDetails = async function (req, res, next) {
    const content = {
        businessName : req.body.businessName,
        gstin: req.body.gstin,
        pan: req.body.pan,
        gstCertificateFile: req.body.gstCertificateFile,
        panCardImage: req.body.panCardImage,
        gstCertificateFileMimeType: req.body.gstCertificateFileMimeType,
        panCardImageFileMimeType: req.body.panCardImageFileMimeType,
        storeLogo: req.body.storeLogo,
        storeName: req.body.storeName,
        storeLocation: req.body.storeLocation,
        isSeller: req.body.isSeller,
        isManufacturer: req.body.isManufacturer,
        businessCategoryId: req.body.businessCategoryId,
        userId: req.decoded.id
    }
    businessDetails.create(content).then(data => {
        if (req.body.isManufacturer) {
            users.update({ is_manufacturer: true }, { where: { userdetailid: req.decoded.id } }).then(result => {
                return res.send({ businessdetails: data, success: true, response_message: "Business Detail Added Successfully." });
            }).catch(err => {
                res.status(500).send({ businessdetails: {}, success: false, response_message: err.message });
            });
         }         
    }).catch(err=>{
        res.status(500).send({ businessdetails: {}, success: false, response_message: err.message });
    });
}

