const mongoose = require("mongoose");

const DiscussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      body: { type: String, required: true },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      createdAt: { type: Date, default: Date.now },
      replies: [
        {
          body: { type: String, required: true },
          author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Discussion", DiscussionSchema);
