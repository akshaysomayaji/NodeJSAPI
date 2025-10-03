module.exports = (sequelize, Sequelize) => {
    const productTagdetails = sequelize.define("productTagdetails",{
        productTagId:{
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        tagName:{
            type: Sequelize.STRING,
            allowNull: false
        },
        isActive:{
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }   
    });
    return productTagdetails;
}