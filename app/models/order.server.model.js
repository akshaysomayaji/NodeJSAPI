module.exports = (sequelize, Sequelize) => {
    const orderDetails = sequelize.define("orderDetails", {
        orderSystemId: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        userId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        orderId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        totalPrice: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: true
        },
        discount: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: true
        },
        finalPrice: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: true
        },
        paymentStatus: {
            type: Sequelize.ENUM('UNPAID', 'PAID'),
            defaultValue: 'UNPAID'        
        },
        address: {
            type: Sequelize.STRING,
            allowNull: true
        },
        paymentMethod: {
            type: Sequelize.STRING,
            allowNull: true
        }
    },{
        tableName: "orderDetails"
    });
    return orderDetails;
}