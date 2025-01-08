const express = require("express");
const Admin = require("../models/admin"); // Import Admin model
const router = express.Router();

// Admin Authentication Route
router.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (admin && admin.password === password) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during admin authentication:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
