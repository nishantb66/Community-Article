const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const User = require("../models/User"); // Assuming you have a User model

// Endpoint to send notifications (Admin only)
router.post("/send", async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    const notification = new Notification({
      title,
      message,
      createdAt: new Date(),
    });

    await notification.save();

    res.status(201).json({ message: "Notification sent successfully!" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Endpoint to fetch notifications for users
router.get("/all", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Mark notification as viewed
router.post("/view", async (req, res) => {
  const { userId, notificationId } = req.body;

  if (!userId || !notificationId) {
    return res
      .status(400)
      .json({ error: "User ID and Notification ID are required" });
  }

  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (!notification.viewedBy.includes(userId)) {
      notification.viewedBy.push(userId);
      await notification.save();
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark notification as viewed" });
  }
});

module.exports = router;
