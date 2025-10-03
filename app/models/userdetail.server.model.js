module.exports = (sequelize, Sequelize) => {
    const UserDetail = sequelize.define("userdetail", {
        userdetailid: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        mobilenumber: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        emailid: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
             defaultValue: false
        },
        userrole: {
            type: Sequelize.STRING
        },
        isApproved: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        // Model options
        timestamps: true, // Adds createdAt and updatedAt fields
        tableName: 'userdetail', // Custom table name
    });
    return UserDetail;
}