module.exports = (sequelize, Sequelize) => {
    const cartProductsDetails = sequelize.define("cartProductsDetails", {
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
        sellerId: {
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
        gst: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: true
        },
        discount: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: true
        },
        finalPrice: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false
        },
        paymentStatus: {
            type: Sequelize.ENUM('UNPAID', 'PAID'),
            allowNull: false,
            defaultValue:'UNPAID'
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        cartId: {
            type: Sequelize.UUID,
            allowNull: false
        }
    });
    return cartProductsDetails;
}