const { where,Op  } = require("sequelize");
const db = require("../../config/plsql");
const businessDetails = db.businessDetails;
exports.addBusinessDetails = async function name(req, res, next) {
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
    }
    businessDetails.create(content).then(data =>{
         return res.send({ businessdetails: data, success: true, response_message: "Business Detail Added." });
    }).catch(err=>{
        res.status(500).send({ businessdetails: {}, success: false, msg: err.message });
    });
}