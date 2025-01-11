const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  details: { type: String, required: true },
  deadline: { type: Date },
  teamMembersRequired: { type: Number, required: true },
  isPaid: { type: Boolean },
  email: { type: String, required: true },
  responses: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
      phone: { type: String },
      message: { type: String, maxlength: 100 },
    },
  ],
});

module.exports = mongoose.model("Proposal", ProposalSchema);
