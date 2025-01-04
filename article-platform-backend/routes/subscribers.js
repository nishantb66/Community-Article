const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

// Subscribe to newsletter
router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ error: "Email already subscribed." });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();
    res.status(201).json({ message: "Subscription successful! 🎉" });
  } catch (err) {
    res.status(500).json({ error: "Failed to subscribe." });
  }
});

module.exports = router;
