const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Import Routes
const emailRoutes = require("./routes/email");
const commentsRoutes = require("./routes/comments");
const subscribersRoutes = require("./routes/subscribers");
const contributorRoutes = require("./routes/contributors");
const usersRoutes = require("./routes/users");
const articleRoutes = require("./routes/articles");
const storyRoutes = require("./routes/storyRoutes");

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;


const corsOptions = {
  origin: 'https://simplearticles.space', // Allow requests from this frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // If you use cookies or authentication
};

// Middleware
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.json());

// API Routes
app.use("/api/email", emailRoutes);
app.use("/api", commentsRoutes);
app.use("/api/subscribe", subscribersRoutes);
app.use("/api/contributors", contributorRoutes);
app.use("/api", usersRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/stories", storyRoutes);

// Serve static files for uploads (if any)
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

