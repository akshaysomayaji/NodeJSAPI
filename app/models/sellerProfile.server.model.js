const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const sellerProfile = sequelize.define("sellerProfile",{
        sellerDetailId:{
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        storeName: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        categoryId:{
            type: Sequelize.UUID,
            allowNull: false,
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
        createdDate:{
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        storeLogo:{
            type: DataTypes.BLOB('long'), // 'tiny', 'medium', 'long'
            allowNull: false,
        }
    });

}