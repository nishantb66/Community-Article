const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

// Subscribe to newsletter
// Subscribe to newsletter
router.post("/sub", async (req, res) => {
  const { email } = req.body;

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "Please provide a valid email address." });
  }

  try {
    // Case insensitive email check
    const existingSubscriber = await Subscriber.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (existingSubscriber) {
      return res.status(409).json({
        error: "This email is already subscribed to our newsletter.",
      });
    }

    const subscriber = new Subscriber({
      email: email.toLowerCase(),
      subscribedAt: new Date(),
    });

    await subscriber.save();

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to our newsletter! 🎉",
    });
  } catch (err) {
    console.error("Subscription error:", err);
    res.status(500).json({
      error:
        "An error occurred while processing your subscription. Please try again.",
    });
  }
});

module.exports = router;
