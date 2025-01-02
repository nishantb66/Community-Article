const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/sendDeleteRequest", async (req, res) => {
  try {
    const { name, email, articleTitle, reason } = req.body;

    // Validate request data
    if (!name || !email || !articleTitle || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com", // Replace with your email
        pass: "your-email-password", // Replace with your email's app password
      },
    });

    const mailOptions = {
      from: email,
      to: "nishantbaruah3@gmail.com", // Replace with your email
      subject: "Delete Article Request",
      text: `Name: ${name}\nEmail: ${email}\nArticle Title: ${articleTitle}\nReason: ${reason}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Request sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send request." });
  }
});

module.exports = router;
