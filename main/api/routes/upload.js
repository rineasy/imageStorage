const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const authenticateToken = require("../utils/authenticateToken"); // Import the middleware
const Image = require("../models/Image");

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    const uniqueName = `${uuidv4()}-shimage-xyz${ext}`;
    cb(null, uniqueName);
  },
});

// Multer File Upload Configuration
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|ico|gif|svg/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Allowed types: jpeg, jpg, png, webp, ico, gif, svg."));
    }
  },
});

// Route: Upload Image
router.post("/", authenticateToken, (req, res, next) => {
  // Handle Multer Errors
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "Multer error: " + err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    next();
  });
});

// Route Logic: Save to Database and Return URL
router.post("/", authenticateToken, async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

  try {
    // Save the image URL in the database
    const image = new Image({ userId: req.user.id, url: imageUrl });
    const savedImage = await image.save();

    console.log("Saved Image:", savedImage);
    res.status(201).json({ url: imageUrl });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ message: "Error saving image to database." });
  }
});

module.exports = router;
