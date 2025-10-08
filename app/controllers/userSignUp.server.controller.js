const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = db.userAccount;

// Register new user
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, phoneCode, phoneNumber, password, location, role } = req.body;

    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const newUser = await User.create({
      fullName,
      email,
      phoneCode,
      phoneNumber,
      password,
      location,
      role,
    });

    res.status(201).json({
      message: "User account created successfully.",
      data: {
        userId: newUser.userId,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("registerUser:", err);
    res.status(500).json({ message: err.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ userId: user.userId, role: user.role }, "secretKey", { expiresIn: "2h" });

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("loginUser:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
      attributes: ["userId", "fullName", "email", "phoneNumber", "role", "accountStatus", "createdAt"],
    });
    res.json(users);
  } catch (err) {
    console.error("getAllUsers:", err);
    res.status(500).json({ message: err.message });
  }
};