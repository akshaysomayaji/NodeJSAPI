module.exports = (sequelize, Sequelize) => {
  const ReturnPolicy = sequelize.define('returnpolicy', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },

    
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Return Policy'
    },

    
    subtitle: {
      type: Sequelize.STRING,
      allowNull: true
    },

    
    refundSteps: {
      type: Sequelize.JSON,
      allowNull: true
    },


    nonReturnableItems: {
      type: Sequelize.JSON,
      allowNull: true
    },

    
    ctaText: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'Request a Return'
    },

    
    heroImageUrl: {
      type: Sequelize.STRING,
      allowNull: true
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    timestamps: true,
    tableName: 'returnpolicy'
  });

  
  ReturnPolicy.seedData = {
    title: 'Return Policy',
    subtitle: 'Shop worry-free. Returning products is simple & quick.',
    heroImageUrl: null,
    refundSteps: [
      { step: 1, title: 'Pickup', description: 'Free pickup from your location', icon: 'pickup' },
      { step: 2, title: 'Inspection', description: 'Quality check at our facility', icon: 'inspection' },
      { step: 3, title: 'Refund', description: 'Money back to wallet/bank', icon: 'refund' }
    ],
    nonReturnableItems: [
      'Groceries',
      'Medicines',
      'Innerwear',
      'Perishables'
    ],
    ctaText: 'Request a Return'
  };

  return ReturnPolicy;
};