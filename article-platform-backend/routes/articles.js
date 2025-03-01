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

// Define specific routes first
router.get("/trending", async (req, res) => {
  try {
    const trendingArticles = await Article.find()
      .sort({ viewed: -1 }) // Sort by number of views in descending order
      .limit(2) // Limit to top 2 articles
      .select("title author viewed createdAt"); // Select only relevant fields

    res.status(200).json(trendingArticles);
  } catch (error) {
    console.error("Error fetching trending articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { title, content } = req.body;
  const author = req.body.author; // This should be the username

  if (!title || !content || !author) {
    return res
      .status(400)
      .json({ message: "Title, content, and author are required." });
  }

  try {
    const newArticle = new Article({ title, content, author });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const articles = await Article.find({ author: username }).sort({
      createdAt: -1,
    });
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching user's articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Ge articles
router.get("/all", async (req, res) => {
  try {
    // Fetch only necessary fields, sorted by createdAt in descending order
    const articles = await Article.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("title author createdAt") // Select only required fields
      .lean(); // Use lean for faster performance

    res.status(200).json({ articles });
  } catch (error) {
    console.error("Error in GET /api/articles:", error); // Log detailed error
    res
      .status(500)
      .json({ message: "Error fetching articles", error: error.message });
  }
});


// Fetch a single article by ID and increment the `viewed` count
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Increment the viewed count and fetch the article
    const article = await Article.findByIdAndUpdate(
      id,
      { $inc: { viewed: 1 } }, // Increment the `viewed` field by 1
      { new: true } // Return the updated document
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
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
    const articles = await Article.find({ author: userId }).sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching user's articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Add this new PUT route for updating articles
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;
    
    // Find the article first
    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    // Check if the current user is the author
    if (article.author !== author) {
      return res.status(403).json({ message: "Unauthorized to edit this article" });
    }
    
    // Update the article
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    
    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Error updating article" });
  }
});




module.exports = router;

