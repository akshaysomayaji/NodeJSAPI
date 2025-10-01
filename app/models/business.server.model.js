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
        type: DataTypes.BLOB('long'), // 'tiny', 'medium', 'long'
        allowNull: false,
    },
    panCardImage:{
        type: DataTypes.BLOB('long'), // 'tiny', 'medium', 'long'
        allowNull: false,
    }    
});
return businessdetails;
}