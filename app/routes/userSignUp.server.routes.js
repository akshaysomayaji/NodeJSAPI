const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userAccount.controller");

// Auth endpoints
router.post("/signup", ctrl.registerUser);
router.post("/login", ctrl.loginUser);

// Admin or debugging: list users
router.get("/", ctrl.getAllUsers);

module.exports = router;