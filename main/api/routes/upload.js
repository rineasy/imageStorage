const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const authenticateToken = require("../utils/authenticateToken");
const Image = require("../models/Image");

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    const uniqueName = `${uuidv4()}-shimage-cloud${ext}`;
    cb(null, uniqueName);
  },
});

// Multer Configuration
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // Limit: 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|ico|gif|svg/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Allowed types: jpeg, jpg, png, webp, ico, gif, svg."
        )
      );
    }
  },
});

// Route: Upload Image and Save to Database
router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Check user's image limit
    const userId = req.user.id;
    const imageCount = await Image.countDocuments({ userId });

    if (imageCount >= 100) {
      return res
        .status(400)
        .json({ message: "Upload limit reached. Maximum 100 images allowed." });
    }

    // Save the image URL in the database
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    const image = new Image({ userId, url: imageUrl });
    const savedImage = await image.save();

    console.log("Saved Image:", savedImage);
    res.status(201).json({ url: imageUrl });
  } catch (err) {
    console.error("Error saving image:", err);
    res.status(500).json({ message: "Error saving image to database." });
  }
});

// Route: Fetch User Images
router.get("/images", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the token
    const images = await Image.find({ userId }); // Fetch images for the user
    res.status(200).json(images);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ message: "Error fetching images" });
  }
});

module.exports = router;
