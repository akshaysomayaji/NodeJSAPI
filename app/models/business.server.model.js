module.exports = (sequelize, Sequelize) => {
const businessdetails = sequelize.define("businessDetails",{
    businessId:{
         type: Sequelize.UUID,
         allowNull: false,
         defaultValue: Sequelize.UUIDV4,
         primaryKey: true,
    },
    businessName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    gstin:{
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
    },
    pan:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    gstCertificateFile:{
        type: Sequelize.BLOB('long'), // 'tiny', 'medium', 'long'
        allowNull: false,
    },
    gstCertificateFileMimeType:{
        type: Sequelize.STRING,
        allowNull: false
    },
    panCardImage:{
        type: Sequelize.BLOB('long'), // 'tiny', 'medium', 'long'
        allowNull: false,
    },
    panCardImageFileMimeType:{
        type: Sequelize.STRING,
        allowNull: false
    },
    isActive:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    createdDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    businessCategoryId:{
        type: Sequelize.UUID,
        allowNull: false,
    }       
});
return businessdetails;
}