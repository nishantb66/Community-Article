const express = require("express");
const Article = require("../models/Article");
const router = express.Router();
const multer = require("multer");
const path = require("path");


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });



// Update Article creation route to handle thumbnail uploads
router.post("/", upload.single("thumbnail"), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;
    const newArticle = new Article({ title, content, author, thumbnail });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: "Error creating article", error });
  }
});

// Get Paginated Articles
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number (default to 1)
    const limit = parseInt(req.query.limit) || 6; // Number of articles per page (default to 6)
    const skip = (page - 1) * limit; // Skip articles based on page number

    const articles = await Article.find()
      .sort({ createdAt: -1 }) // Sort by latest articles
      .skip(skip)
      .limit(limit);

    const totalArticles = await Article.countDocuments(); // Get total article count

    res.status(200).json({
      articles,
      totalArticles,
      totalPages: Math.ceil(totalArticles / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
});


// Get Single Article
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "Error fetching article", error });
  }
});


// Mark an article as reported
router.post("/:id/report", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).send({ message: "Reason is required." });
    }

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).send({ message: "Article not found." });
    }

    // Mark article as reported
    article.reported = true;
    article.reportReason = reason;
    await article.save();

    res.status(200).send({ message: "Article reported successfully." });
  } catch (err) {
    console.error("Error reporting article:", err);
    res.status(500).send({ message: "Server error." });
  }
});


// Fetch articles written by a specific user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const articles = await Article.find({ authorId: userId });
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching user's articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;

