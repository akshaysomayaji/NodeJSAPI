module.exports = (sequelize, Sequelize) => {
    const paymentDetails = sequelize.define("paymentDetails",{
        paymentId :{
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        bankHolderName:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        bankAccountNumber:{
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        bankName:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        bankIFSCCode:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        paymentMethod:{
            type: Sequelize.STRING,
            allowNull: false
        },
        upiId:{
            type: Sequelize.STRING,
            allowNull: false
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        userId:{
            type: Sequelize.UUID,
            allowNull: false,
        }   
    });
    return paymentDetails;
}