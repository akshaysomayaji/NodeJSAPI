module.exports = (sequelize, Sequelize) => {
    const orderDetails = sequelize.define("orderDetails", {
        orderId: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        userId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        productId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        price: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        paymentMethod: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return orderDetails;
}