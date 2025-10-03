module.exports = (sequelize, Sequelize) => {
    const productImagedetails = sequelize.define("productImagedetails",{
        productImageId:{
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        productId:{
            type: Sequelize.UUID,
            allowNull: false,
        },
        imageContent:{
            type: DataTypes.BLOB('long'), // 'tiny', 'medium', 'long'
            allowNull: false,
        },
        imageName:{
            type: Sequelize.STRING,
            allowNull: false
        },
        createdDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        }  
    });
    return productImagedetails;
}