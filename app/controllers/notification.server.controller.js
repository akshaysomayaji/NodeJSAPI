const db = require('../models'); // adjust path to where you import sequelize models
const Notification = db.notification;

exports.getGrouped = async (req, res) => {
  try {
    // get all notifications (you can add userId filter, limit, pagination etc.)
    const rows = await Notification.findAll({
      order: [['createdAt', 'DESC']]
    });

    // group by category similar to your screenshot (Today, Yesterday, This Week)
    const grouped = rows.reduce((acc, n) => {
      const cat = n.category || 'This Week';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(n);
      return acc;
    }, {});

    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }

 await Notification.bulkCreate(Notification.seedData);
};