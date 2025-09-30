module.exports = (sequelize, Sequelize) => {
    const UserDetail = sequelize.define("userdetail", {
        userdetailid: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: false,
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
        createdDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
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