const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  interestedDomains: { type: [String], default: [] },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }], // Reference to the Article model
});

module.exports = mongoose.model("User", UserSchema);
