const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Prevent spaces in username
  if (/\s/.test(username)) {
    return res.status(400).json({ error: "Username must not contain spaces." });
  }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ name, username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Interests Route
router.post("/interests", async (req, res) => {
  const { username, domains } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { username },
      { $set: { interestedDomains: domains } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Interests added successfully", user });
  } catch (err) {
    res.status(400).json({ error: "Failed to update interests" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to login" });
  }
});



// Add Bookmark
router.post("/bookmarks/add", async (req, res) => {
  const { userId, articleId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(articleId)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid userId or articleId format" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.bookmarks.includes(articleId)) {
      return res.status(400).json({ message: "Article already bookmarked" });
    }

    user.bookmarks.push(articleId);
    await user.save();

    res.status(200).json({
      message: "Article bookmarked successfully",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Bookmarked Articles
router.get("/bookmarks/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  try {
    const user = await User.findById(userId).populate("bookmarks");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.bookmarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Remove Bookmark
router.post("/bookmarks/remove", async (req, res) => {
  const { userId, articleId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(articleId)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid userId or articleId format" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== articleId);
    await user.save();

    res.status(200).json({
      message: "Bookmark removed successfully",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
