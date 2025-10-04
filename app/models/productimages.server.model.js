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
            type: Sequelize.BLOB('long'), // 'tiny', 'medium', 'long'
            allowNull: false,
        },
        imageFileMimeType:{
            type: Sequelize.STRING,
            allowNull: false
        },
        imageName:{
            type: Sequelize.STRING,
            allowNull: false
        },
        selectedImage:{
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        isActive:{
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        imageType:{
            type: Sequelize.STRING,
            allowNull: false
        }  
    });
    return productImagedetails;
}