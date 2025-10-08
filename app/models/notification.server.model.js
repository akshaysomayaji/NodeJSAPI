module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define('notification', {
    notificationId: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    // short headline (e.g. "Price Drop Alert", "Order Shipped")
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // optional longer description
    message: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    // category such as "Today", "Yesterday", "This Week"
    category: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'This Week'
    },
    // tag to mark special types (price_drop, order_shipped, new_arrival, limited_offer, seller_response, achievement, follower)
    type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    // whether the user has read the notification
    isRead: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    // if this notification is starred/important
    isImportant: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    // store any small metadata (json-string)
    meta: {
      type: Sequelize.JSON, // if your DB supports JSON; otherwise use STRING
      allowNull: true
    }
  }, {
    timestamps: true,        // createdAt = when it arrived
    tableName: 'notification' // custom table name matching your style
  });

 notification.seedData = [
  {
    title: 'Price Drop Alert',
    message: 'The bag you liked dropped 20%',
    category: 'Today',
    type: 'price_drop',
    isImportant: true
  },
  {
    title: 'Order Shipped',
    message: 'Your order #12345 has been shipped',
    category: 'Today',
    type: 'order_shipped'
  },
  {
    title: 'New Arrival',
    message: 'New summer collection is here',
    category: 'Today',
    type: 'new_arrival'
  },
  {
    title: 'Limited Offer',
    message: 'Flash sale ended yesterday',
    category: 'Yesterday',
    type: 'limited_offer'
  },
  {
    title: 'Seller Response',
    message: 'Seller replied to your question',
    category: 'Yesterday',
    type: 'seller_response'
  },
  {
    title: 'Achievement unlocked',
    message: 'You reached 100 purchases',
    category: 'This Week',
    type: 'achievement'
  },
  {
    title: 'New follower',
    message: 'Someone started following your profile',
    category: 'This Week',
    type: 'follower'
  }
];
return Notification;

};