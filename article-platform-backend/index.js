const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const emailRoutes = require("./routes/email");
const commentsRoutes = require("./routes/comments");
const subscribersRoutes = require("./routes/subscribers");
const contributorRoutes = require("./routes/contributors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: 'https://simplearticles.space', // Allow requests from this frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // If you use cookies or authentication
};

// Middleware
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.json()); // Middleware to parse JSON
app.use("/api", emailRoutes); // Register the email route
app.use("/api", commentsRoutes);
app.use("/api/subscribe", subscribersRoutes);
app.use("/api/contributors", contributorRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// API Routes
const articleRoutes = require("./routes/articles");
app.use("/api/articles", articleRoutes);
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

