var crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
    const UserPasswordDetail = sequelize.define("userpassworddetail", {
        userpasswordid: {
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        password:{
            type: Sequelize.STRING,
            allowNull: false
        },
        userid:{
            type : Sequelize.UUID,
            allowNull: false
        },
        createdDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        isPasswordReset:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        // Model options
        timestamps: true, // Adds createdAt and updatedAt fields
        tableName: 'userpassworddetail', // Custom table name
    });

    UserPasswordDetail.prototype.comparepasswords = function (password) {
      var md5 = crypto.createHash('md5');
      md5 = md5.update(password).digest('hex');
      return this.password === md5;
    };
    return UserPasswordDetail;
}
