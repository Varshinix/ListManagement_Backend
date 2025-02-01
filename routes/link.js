const express = require("express");
const crypto = require("crypto");  // For hashing the URL
const Link = require("../schemas/link.schema");

const router = express.Router();

// Function to generate a hash from the URL
function generateHash(url) {
    return crypto.createHash("sha256").update(url).digest("hex").slice(0, 8);  // Take first 8 chars
}

// Create a new shortened link
router.post("/shorten", async (req, res) => {
    try {
        const { originalUrl, remarks, expiresAt } = req.body;

        if (!originalUrl) {
            return res.status(400).json({ message: "Destination URL is required" });
        }

        // Generate a short code using the hashed URL
        const shortCode = generateHash(originalUrl);

        // Check if this URL has already been shortened
        let existingLink = await Link.findOne({ shortCode });

        if (!existingLink) {
            // If not found, create a new entry
            existingLink = new Link({ originalUrl, shortCode, expiresAt: expiresAt || null, remarks });
            await existingLink.save();
        }

        res.status(201).json({
            message: "Shortened link created successfully",
            shortUrl: `https://listmanagement-backend.onrender.com/${shortCode}`
        });

    } catch (error) {
        console.error("Error creating shortened link:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Redirect to the original URL
router.get("/:shortCode", async (req, res) => {
    try {
        const { shortCode } = req.params;
        const link = await Link.findOne({ shortCode });

        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }

        // Check if the link has expired
        if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
            return res.status(410).json({ message: "This link has expired" });
        }

        res.redirect(link.originalUrl);
    } catch (error) {
        console.error("Error redirecting:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
