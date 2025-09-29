var crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
    const UserPasswordDetail = sequelize.define("userdetail", {
        userpasswordid: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        password:{
            type: Sequelize.STRING,
            allowNull: false
        },
        userid:{
            type : Sequelize.STRING,
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
    });

    UserPasswordDetail.prototype.comparepasswords = function (password) {
      var md5 = crypto.createHash('md5');
      md5 = md5.update(password).digest('hex');
      return this.password === md5;
    };
    return UserPasswordDetail;
}
