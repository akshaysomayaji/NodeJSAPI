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
        }
    });
    return cartDetails;
}