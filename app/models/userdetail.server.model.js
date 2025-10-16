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
            type: Sequelize.ENUM('ADMIN', 'BUYER', 'SELLER'),
        },
        is_manufacturer: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
            validate: {
                async isSellerOnly(value) {
                    if (value === true && this.role !== 'SELLER') {
                        throw new Error('Only SELLER can be a manufacturer');
                    }
                },
            },
        },
        isApproved: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        isSetupCompleted: {
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