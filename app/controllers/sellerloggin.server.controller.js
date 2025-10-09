// controllers/selleraccount.controller.js
const { SellerAccount, sequelize } = require("../models");
const { Op } = require("sequelize");

// Helper: generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

module.exports = {
  // Create seller (via email or phone)
  createAccount: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { emailid, phonenumber, countrycode = "+91" } = req.body;

      if (!emailid && !phonenumber) {
        await t.rollback();
        return res.status(400).json({ success: false, message: "Email or phone number required" });
      }

      const otp = generateOTP();
      const otpexpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min validity

      const account = await SellerAccount.create(
        {
          emailid: emailid || null,
          phonenumber: phonenumber || null,
          countrycode,
          otp,
          otpexpiry,
          isverified: false,
        },
        { transaction: t }
      );

      await t.commit();
      return res.status(201).json({
        success: true,
        message: "OTP sent successfully (mock).",
        data: { sellerid: account.sellerid, otp },
      });
    } catch (err) {
      await t.rollback();
      console.error("createAccount error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Verify OTP
  verifyOTP: async (req, res) => {
    try {
      const { sellerid, otp } = req.body;
      const record = await SellerAccount.findByPk(sellerid);
      if (!record) return res.status(404).json({ success: false, message: "Seller not found" });

      if (record.otp !== otp)
        return res.status(400).json({ success: false, message: "Invalid OTP" });

      if (new Date() > new Date(record.otpexpiry))
        return res.status(400).json({ success: false, message: "OTP expired" });

      record.isverified = true;
      record.accountstatus = "Active";
      record.otp = null;
      record.otpexpiry = null;
      await record.save();

      return res.json({ success: true, message: "OTP verified successfully", data: record });
    } catch (err) {
      console.error("verifyOTP error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Social login (Google or Facebook)
  socialLogin: async (req, res) => {
    try {
      const { provider, token } = req.body;
      if (!provider || !token)
        return res.status(400).json({ success: false, message: "Provider and token required" });

      let data = {};
      if (provider === "google") data = { googletoken: token };
      if (provider === "facebook") data = { facebooktoken: token };

      const account = await SellerAccount.create({
        ...data,
        isverified: true,
        accountstatus: "Active",
      });

      return res.status(201).json({ success: true, message: "Social login success", data: account });
    } catch (err) {
      console.error("socialLogin error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Resend OTP
  resendOTP: async (req, res) => {
    try {
      const { sellerid } = req.body;
      const record = await SellerAccount.findByPk(sellerid);
      if (!record) return res.status(404).json({ success: false, message: "Seller not found" });

      const otp = generateOTP();
      const otpexpiry = new Date(Date.now() + 5 * 60 * 1000);
      record.otp = otp;
      record.otpexpiry = otpexpiry;
      await record.save();

      return res.json({ success: true, message: "OTP resent (mock).", data: { otp } });
    } catch (err) {
      console.error("resendOTP error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },

  // Fetch account info
  getSellerAccount: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await SellerAccount.findByPk(id);
      if (!record) return res.status(404).json({ success: false, message: "Seller not found" });
      return res.json({ success: true, data: record });
    } catch (err) {
      console.error("getSellerAccount error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  },
};