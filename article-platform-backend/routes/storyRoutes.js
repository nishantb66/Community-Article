const express = require("express");
const Story = require("../models/Story");

const router = express.Router();

// Get all stories
router.get("/", async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stories." });
  }
});

// Add a new story
router.post("/", async (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const story = new Story({ title, content, author });
    await story.save();
    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ message: "Error saving the story." });
  }
});

// Get a single story by ID
router.get("/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json(story);
  } catch (err) {
    console.error("Error fetching story:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
