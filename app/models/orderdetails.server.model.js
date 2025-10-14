module.exports = (sequelize, Sequelize) => {
    const orderDetails = sequelize.define("orderDetails", {
        orderSystemId: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        orderId: {
            type: DataTypes.STRING,
            primaryKey: true,
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
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM('Ordered', 'Shipped', 'Delivered', 'Cancelled', 'Refunded', 'Failed', 'Completed',
                'Returned','Return Requested'),
            allowNull: false,
        }
    },{
        tableName: "orderDetails",
        timestamps: true,
        hooks: {
            beforeCreate: async (order, options) => {
                // Generate custom ID
                const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
                const count = await Order.count({
                    where: Sequelize.where(
                        Sequelize.fn("DATE", Sequelize.col("createdAt")),
                        "=",
                        Sequelize.fn("DATE", new Date())
                    ),
                });

                const sequence = String(count + 1).padStart(4, "0");
                order.orderId = `ORD-${datePart}-${sequence}`;
            },
        },
    })
}
