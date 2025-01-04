const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false },
  reportReason: { type: String },
});

module.exports = mongoose.model("Article", ArticleSchema);

