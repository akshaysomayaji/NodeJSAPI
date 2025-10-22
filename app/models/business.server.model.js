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
        unique: false
    },
    gstin:{
        type: Sequelize.STRING,
        allowNull: false,
        unique:false
    },
    pan:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
    },
    gstCertificateFile:{
        type: Sequelize.BLOB('long'), // 'tiny', 'medium', 'long'
        allowNull: true,
    },
    gstCertificateFileMimeType:{
        type: Sequelize.STRING,
        allowNull: true
    },
    panCardImage:{
        type: Sequelize.BLOB('long'), // 'tiny', 'medium', 'long'
        allowNull: true,
    },
    panCardImageFileMimeType:{
        type: Sequelize.STRING,
        allowNull: true
    },
    storeName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
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
        allowNull: true,
    },  
    isActive:{
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    businessStatus: {
        type: Sequelize.ENUM('Active', 'Inactive', 'Suspended'),
        allowNull: false,
        defaultValue: 'Active'
    },
    userId:{
        type: Sequelize.UUID,
        allowNull: false,
    }     
});
return businessdetails;
}