const express = require("express");
const mongoose = require("mongoose");
const Proposal = require("../models/Proposal");
const router = express.Router();

// Create a Proposal
router.post("/create", async (req, res) => {
  const {
    userId,
    description,
    details,
    deadline,
    teamMembersRequired,
    isPaid,
    email,
  } = req.body;

  if (!userId || !description || !details || !teamMembersRequired || !email) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const newProposal = new Proposal({
      userId,
      description,
      details,
      deadline,
      teamMembersRequired,
      isPaid,
      email,
    });
    await newProposal.save();
    res
      .status(201)
      .json({
        message: "Proposal created successfully",
        proposal: newProposal,
      });
  } catch (error) {
    console.error("Error creating proposal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/my-proposals/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  try {
    const proposals = await Proposal.find({ userId })
      .populate("responses.userId", "name") // Populate the name of the respondent
      .exec();

    res.status(200).json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Add Response to a Proposal
router.post("/respond", async (req, res) => {
  const { proposalId, email, phone, message } = req.body;

  if (!proposalId || !email || !message) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  if (message.length > 100) {
    return res
      .status(400)
      .json({ message: "Message must not exceed 100 words" });
  }

  try {
    const proposal = await Proposal.findById(proposalId);
    if (!proposal)
      return res.status(404).json({ message: "Proposal not found" });

    proposal.responses.push({ email, phone, message });
    await proposal.save();
    res.status(200).json({ message: "Response added successfully", proposal });
  } catch (error) {
    console.error("Error adding response:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/explore", async (req, res) => {
  try {
    // Populate only the "name" field of the user who created the proposal
    const proposals = await Proposal.find().populate("userId", "name");
    res.status(200).json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Update proposal route
router.put('/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { 
        description: req.body.description,
        details: req.body.details,
        deadline: req.body.deadline,
        teamMembersRequired: req.body.teamMembersRequired,
        isPaid: req.body.isPaid 
      },
      { new: true }
    );
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating proposal' });
  }
});

// Delete proposal route
router.delete('/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndDelete(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    
    res.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting proposal' });
  }
});



module.exports = router;
