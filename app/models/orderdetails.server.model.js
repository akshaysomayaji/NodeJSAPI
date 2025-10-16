module.exports = (sequelize, Sequelize) => {
    const orderProductDetails = sequelize.define("orderProductDetails", {
        orderSystemId: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        orderId: {
            type: DataTypes.STRING,
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
        status: {
            type: Sequelize.ENUM('Ordered', 'Shipped', 'Delivered', 'Cancelled', 'Refunded', 'Failed', 'Completed',
                'Returned','Return Requested'),
            allowNull: false,
        }
    });
    return orderProductDetails;
}
