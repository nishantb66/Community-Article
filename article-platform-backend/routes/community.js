const express = require("express");
const mongoose = require("mongoose");
const Discussion = require("../models/Discussion");
const User = require("../models/User");

const router = express.Router();

// Create a new discussion
router.post("/create", async (req, res) => {
  const { title, body, userId } = req.body;

  if (!title || !body || !userId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const newDiscussion = new Discussion({ title, body, author: userId });
    const savedDiscussion = await newDiscussion.save();

    res.status(201).json(savedDiscussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Fetch all discussions
router.get("/", async (req, res) => {
  try {
    const discussions = await Discussion.find()
      .populate("author", "username")
      .populate("comments.author", "username")
      .populate("comments.replies.author", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(discussions);
  } catch (error) {
    console.error("Error fetching discussions:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



// Fetch a single discussion by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const discussion = await Discussion.findById(id)
      .populate("author", "username")
      .populate("comments.author", "username")
      .populate("comments.replies.author", "username");

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found." });
    }

    res.status(200).json(discussion);
  } catch (error) {
    console.error("Error fetching discussion:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Add a comment to a discussion
router.post("/:id/comment", async (req, res) => {
  const { body, userId } = req.body;
  const { id } = req.params;

  if (!body || !userId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found." });
    }

    discussion.comments.push({ body, author: userId });
    const updatedDiscussion = await discussion.save();

    res.status(201).json(updatedDiscussion);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// Add a reply to a comment
router.post("/:discussionId/comments/:commentId/reply", async (req, res) => {
  console.log("Reply route hit:", req.params, req.body);
  const { body, userId } = req.body;
  const { discussionId, commentId } = req.params;

  if (!body || !userId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion)
      return res.status(404).json({ message: "Discussion not found." });

    const comment = discussion.comments.id(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found." });

    comment.replies.push({ body, author: userId });
    await discussion.save();

    res.status(201).json({ message: "Reply added successfully.", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
