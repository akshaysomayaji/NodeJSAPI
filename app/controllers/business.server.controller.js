const { where,Op  } = require("sequelize");
const db = require("../../config/plsql");
const businessDetails = db.businessDetails;
const users = db.userdetails;
exports.addBusinessDetails = async function (req, res, next) {
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
        isManufacturer: req.body.role == 'manufacturer' ? true : false,
        businessCategoryId: req.body.businessCategory,
        userId: req.decoded.id
    };
    const _userrole = req.body.role == 'seller' ? 'SELLER' : req.body.role == 'manufacturer' ? 'MANUFACTURER' : req.body.role ;
    businessDetails.create(content).then(data => {
        console.log("response data "+ data);
        const updateobject = {
            isSetupCompleted: true,
            mobilenumber: req.body.phoneNo,
            emailID: req.body.emailID,
            userrole: _userrole
        }
        if (req.body.role == 'manufacturer') {
            updateobject.is_manufacturer = true;
        }
        console.log('user request' + updateobject);
        console.log('req.decoded.id ' + req.decoded.id);
        users.update(updateobject, { where: { userdetailid: req.decoded.id } }).then(result => {
            if (result) {
                return res.send({ businessdetails: data, success: true, response_message: "Business Detail Added Successfully." });
            }            
        }).catch(err => {
            console.log(err);
            res.status(500).send({ businessdetails: {}, success: false, response_message: err.message });
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).send({ businessdetails: {}, success: false, response_message: err });
    });
}

