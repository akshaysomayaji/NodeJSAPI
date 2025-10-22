module.exports = (sequelize, Sequelize) => {
    const cartDetails = sequelize.define("cartDetails", {
        cartId: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        userId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        totalAmount: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        discount: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: true
        },
        shipping: {
            type: Sequelize.ENUM('FREE', 'Chargable'),
        },
        shippingCharge: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        shippingAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        paymentStatus: {
            type: Sequelize.ENUM('Pending', 'Success', 'Failed', 'Cancelled', 'Refunded','Processing'),
            defaultValue: 'Pending'
        },
        cartStatus: {
            type: Sequelize.ENUM('CHECKED_IN', 'CHECKED_OUT'),
            defaultValue: 'CHECKED_IN'
        },
        finalPrice:{
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    });
    return cartDetails;
}