module.exports = (sequelize, Sequelize) => {
    const subcateogryDetails = sequelize.define("subcateogryDetails",{
        subcategoryId :{
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        subcategoryIcon:{
            type: Sequelize.BLOB('long'),
            allowNull: true 
        },
        subcategoryDescription:{
            type: Sequelize.STRING,
            allowNull: true
        },
        parentCategoryId:{
            type: Sequelize.UUID,
            allowNull: false
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
    return subcateogryDetails;
}