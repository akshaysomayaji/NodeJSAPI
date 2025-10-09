// routes/selleraccount.routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/selleraccount.controller");

// Create account (email or phone)
router.post("/", ctrl.createAccount);

// Verify OTP
router.post("/verify", ctrl.verifyOTP);

// Resend OTP
router.post("/resend-otp", ctrl.resendOTP);

// Social login (Google/Facebook)
router.post("/social-login", ctrl.socialLogin);

// Get seller account info
router.get("/:id", ctrl.getSellerAccount);

module.exports = router;