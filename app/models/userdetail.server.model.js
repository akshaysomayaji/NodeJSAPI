module.exports = (sequelize, Sequelize) => {
    const UserDetail = sequelize.define("userdetail", {
        userdetailid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fullname: {
            type: Sequelize.STRING
        },
        mobilenumber: {
            type: Sequelize.STRING
        },
        emailid: {
            type: Sequelize.STRING
        },
        isActive: {
            type: Sequelize.BOOLEAN
        },
        createdDate: {
            type: Sequelize.DATE
        },
        userrole: {
            type: Sequelize.STRING
        },
        isApproved: {
            type: Sequelize.BOOLEAN
        }
    });
}