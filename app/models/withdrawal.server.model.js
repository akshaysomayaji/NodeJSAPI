module.exports = (sequelize, Sequelize) => {
  const Withdrawal = sequelize.define(
    'withdrawal',
    {
      withdrawalid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      sellerId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        validate: { min: 0 },
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'INR',
      },
      method: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending',
        validate: { isIn: [['pending','approved','denied']] }
      },
      note: { type: Sequelize.STRING, allowNull: true }
    },
    {
      tableName: 'withdrawals',
      timestamps: true,
    }
  );
  return Withdrawal;
};