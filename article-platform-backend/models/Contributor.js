const mongoose = require("mongoose");

const contributorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contributor", contributorSchema);
