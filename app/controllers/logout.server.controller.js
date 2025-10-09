const db = require("../models");
const LogoutDetail = db.LogoutDetail || db.logoutdetail;

/**
 * POST /api/logout/request
 * Create a new logout confirmation record for a seller
 */
exports.requestLogout = async (req, res) => {
  try {
    const { sellerid } = req.body;
    if (!sellerid) {
      return res.status(400).json({ success: false, message: "Seller ID is required" });
    }

    const logoutRecord = await LogoutDetail.create({
      sellerid,
      status: "Pending",
      confirmationmessage: "Are you sure you want to log out of your seller account?",
    });

    return res.status(201).json({ success: true, data: logoutRecord });
  } catch (err) {
    console.error("Error creating logout record:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * PUT /api/logout/confirm/:id
 * Confirm the logout (mark as logged out)
 */
exports.confirmLogout = async (req, res) => {
  try {
    const { id } = req.params;

    const logoutRecord = await LogoutDetail.findByPk(id);
    if (!logoutRecord) {
      return res.status(404).json({ success: false, message: "Logout request not found" });
    }

    logoutRecord.status = "Confirmed";
    logoutRecord.loggedoutat = new Date();
    await logoutRecord.save();

    return res.json({ success: true, message: "Logout confirmed", data: logoutRecord });
  } catch (err) {
    console.error("Error confirming logout:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * GET /api/logout/history/:sellerid
 * Get all logout history for a seller
 */
exports.getLogoutHistory = async (req, res) => {
  try {
    const { sellerid } = req.params;
    if (!sellerid) {
      return res.status(400).json({ success: false, message: "Seller ID required" });
    }

    const records = await LogoutDetail.findAll({
      where: { sellerid },
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, data: records });
  } catch (err) {
    console.error("Error fetching logout history:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};