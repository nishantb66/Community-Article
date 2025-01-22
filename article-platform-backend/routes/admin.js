const express = require("express");
const Admin = require("../models/admin"); // Import Admin model
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Comment = require("../models/Comment");
const Contributor = require("../models/Contributor");
const Discussion = require("../models/Discussion");
const Proposal = require("../models/Proposal");
const Subscriber = require("../models/Subscriber");
const User = require("../models/User");


// Admin Authentication Route
router.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (admin && admin.password === password) {
      // Generate a JWT token
      const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during admin authentication:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Failed to authenticate token" });
    }
    req.adminId = decoded.id; // Attach adminId to request
    next();
  });
};

// Protected route for admin access
router.get("/all-data", verifyToken, async (req, res) => {
  try {
    const comments = await Comment.find();
    const contributors = await Contributor.find();
    const discussions = await Discussion.find();
    const proposals = await Proposal.find();
    const subscribers = await Subscriber.find();
    const users = await User.find();

    res.status(200).json({
      success: true,
      data: {
        comments,
        contributors,
        discussions,
        proposals,
        subscribers,
        users,
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
