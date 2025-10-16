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
        orderId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        totalPrice: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false
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
            defaultValue: 'PAID'        
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        paymentMethod: {
            type: Sequelize.STRING,
            allowNull: false
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
    }));
    return orderDetails;
}