const { where,Op  } = require("sequelize");
const db = require("../../config/plsql");
const businessDetails = db.businessDetails;
const users = db.userdetails;
exports.addBusinessDetails = async function (req, res, next) {
    console.log(req.body);
    const content = {
        businessName: req.body.businessName,
        gstin: req.body.gstNumber,
        pan: req.body.panNumber,
        gstCertificateFile: req.body.gstCertificate,
        panCardImage: req.body.panCardImage,
        gstCertificateFileMimeType: req.body.gstCertificateFileMimeType,
        panCardImageFileMimeType: req.body.panCardImageFileMimeType,
        storeLogo: req.body.storeLogo,
        storeName: req.body.storeName,
        storeLocation: req.body.location,
        isSeller: req.body.role == 'seller' ? true : false,
        isManufacturer: false,
        businessCategoryId: req.body.businessCategory,
        userId: req.decoded.id
    }
    console.log(content);
    businessDetails.create(content).then(data => {
        console.log(data);
        const updateobject = {
            isSetupCompleted: true,
            mobilenumber: req.body.phoneNo,
            emailID: req.body.emailID
        }
        if (req.body.isManufacturer) {
            updateobject.is_manufacturer = true;
        }
        users.update(updateobject, { where: { userdetailid: req.decoded.id } }).then(result => {
            return res.send({ businessdetails: data, success: true, response_message: "Business Detail Added Successfully." });
        }).catch(err => {
            res.status(500).send({ businessdetails: {}, success: false, response_message: err.message });
        });
    }).catch(err=>{
        res.status(500).send({ businessdetails: {}, success: false, response_message: err.message });
    });
}

