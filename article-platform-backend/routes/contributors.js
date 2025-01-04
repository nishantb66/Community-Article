const express = require("express");
const Contributor = require("../models/Contributor");

const router = express.Router();

// Add contributor
router.post("/", async (req, res) => {
  const { name, email, reason } = req.body;
  if (!name || !email || !reason) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const contributor = new Contributor({ name, email, reason });
    await contributor.save();
    res.status(201).json({ message: "Contributor added successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to add contributor.", error: err });
  }
});

module.exports = router;
