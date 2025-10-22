module.exports = (sequelize, Sequelize) => {
    const orderProductDetails = sequelize.define("orderProductDetails", {
        orderProductId: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        orderId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        buyyerId: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
        },
        sellerId: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
        },
        cartProductId: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
        },
        price: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false
        },
        totalPrice: {
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
            defaultValue: 'UNPAID'
        },
        status: {
            type: Sequelize.ENUM('Ordered', 'Shipped', 'Delivered', 'Cancelled', 'Refunded', 'Failed', 'Completed',
                'Returned','Return Requested'),
            allowNull: false,
            defaultValue: 'Ordered'
        }
    });
    return orderProductDetails;
}
