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
    storeName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    storeLocation:{
        type: Sequelize.STRING,
        allowNull: false
    },
    isSeller:{
        type : Sequelize.BOOLEAN,
        allowNull: false,
        default: false
    },
    isManufacturer:{
        type : Sequelize.BOOLEAN,
        allowNull: false,
        default: false
    },
    businessCategoryId:{
        type: Sequelize.UUID,
        allowNull: false,
    },
    storeLogo:{
        type: Sequelize.BLOB('long'), // 'tiny', 'medium', 'long'
        allowNull: false,
    },  
    isActive:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    userId:{
        type: Sequelize.UUID,
        allowNull: false,
    }     
});
return businessdetails;
}