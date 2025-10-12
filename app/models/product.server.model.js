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
        adminApprovedStatus: {
            type: Sequelize.ENUM('SUBMITTED', 'APPROVED', 'REJECTED', 'REVIEWING', ),
            allowNull: false,
            defaultValue: 'SUBMITTED'
        },
        isActive:{
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        adminId: {
            type: Sequelize.UUID,
            allowNull: true,
        },
        createdUser:{
            type: Sequelize.UUID,
            allowNull: false,
        }
    });
    return productdetails;
}