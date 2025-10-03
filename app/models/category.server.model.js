module.exports = (sequelize, Sequelize) => {
    const cateogryDetails = sequelize.define("cateogryDetails",{
        categoryId :{
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        categoryIcon:{
            type: Sequelize.BLOB('long'),
            allowNull: true 
        },
        categoryDescription:{
            type: Sequelize.STRING,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        createdDate:{
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,            
        }
    }); 
    return cateogryDetails;
}