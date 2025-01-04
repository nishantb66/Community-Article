const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// Get all comments for an article
router.get("/articles/:articleId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({
      articleId: req.params.articleId,
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

// Add a comment to an article
router.post("/articles/:articleId/comments", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required." });
  }

  try {
    const comment = new Comment({
      articleId: req.params.articleId,
      content,
    });

    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ error: "Failed to post comment." });
  }
});

module.exports = router;
