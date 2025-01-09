const express = require("express");
const nodemailer = require("nodemailer");
const OTP = require("../models/OTP");
const User = require("../models/User");
const router = express.Router();
const crypto = require("crypto");

// Email Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Route: Send OTP
router.post("/send", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Check if the email exists in the User model
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP to the database
    await OTP.create({ email, otp });

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP for Email Verification",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP." });
  }
});

// Route: Verify OTP
router.post("/verify", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  try {
    // Find the OTP in the database
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // OTP is valid, delete the OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    // Mark user as verified in the User model
    await User.findOneAndUpdate({ email }, { isVerified: true });

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP." });
  }
});

// Route: Check Verification Status
router.post("/check-status", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

    res.status(200).json({ isVerified: user.isVerified });
  } catch (error) {
    console.error("Error checking verification status:", error);
    res.status(500).json({ message: "Error checking verification status." });
  }
});

module.exports = router;
