module.exports = (sequelize, Sequelize) => {
    const Tagdetails = sequelize.define("tagdetails",{
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
    return Tagdetails;
}