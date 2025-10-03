module.exports = (sequelize, Sequelize) => {
    const productdetails = sequelize.define("productdetails",{
        productId:{
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        productName:{
            type: Sequelize.STRING,
            allowNull: false
        },
        sku:{
            type: Sequelize.STRING,
            allowNull: false
        },
        productDescription :{
            type: Sequelize.STRING,
            allowNull: true
        },
        productPrice : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        discountPrice:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        stockQuantity:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        lowStockAlert:{
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        categoryId:{
            type: Sequelize.UUID,
            allowNull: false,
        },
        subcategoryId:{
            type: Sequelize.UUID,
            allowNull: false,
        },
        brandName:{
            type: Sequelize.STRING,
            allowNull: false
        },
        productStatus:{
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        isActive:{
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        userId:{
            type: Sequelize.UUID,
            allowNull: false,
        },
        tagId:{
            type: Sequelize.UUID,
            allowNull: true,
        }      
    });
    return productdetails;
}