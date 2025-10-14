module.exports = (sequelize, Sequelize) => {
    const cartDetails = sequelize.define("cartDetails", {
        cartProductId: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        userId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        cartId: {
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
            allowNull: false,
            validate: {
                async isNotFree(value) {
                    if (this.shipping !== 'FREE') {
                        value = 50
                    }
                },
            },
        },
        shippingAddress: {
            type: Sequelize.STRING,
            allowNull: false
        },
        paymentStatus: {
            type: Sequelize.ENUM('Pending', 'Success', 'Failed', 'Cancelled', 'Refunded','Processing'),
            defaultValue: 'Pending'
        },
        status: {
            type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
            defaultValue: 'ACTIVE'
        }
    });
    return cartDetails;
}