const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, // New field to track verification status
  interestedDomains: { type: [String], default: [] },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
});

module.exports = mongoose.model("User", UserSchema);

