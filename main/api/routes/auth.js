const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BlacklistedToken = require("../models/BlacklistedToken");
const authenticateToken = require("../utils/authenticateToken");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all required fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    console.log(`User registered successfully: ${email}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: User with email ${email} not found.`);
      return res.status(404).json({ message: "User not found" });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Login failed: Invalid credentials for email ${email}.`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate the token with an expiration time
    const token = jwt.sign(
      { id: user._id }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Expiration
    );

    console.log(`User logged in successfully: ${email}`);
    res.status(200).json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout
router.post("/logout", authenticateToken, async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token

  try {
    // Check if the token exists in the request
    if (!token) {
      console.log("Logout failed: No token provided.");
      return res.status(401).json({ message: "No token provided." });
    }

    // Decode the token to get its expiration time
    const decoded = jwt.decode(token);

    // Add the token to the blacklist
    const blacklistedToken = new BlacklistedToken({
      token,
      expiresAt: new Date(decoded.exp * 1000), // Convert expiration to milliseconds
    });

    await blacklistedToken.save(); // Save the token in the blacklist collection

    console.log(`User logged out successfully. Token blacklisted.`);
    res.status(200).json({ message: "Successfully logged out" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ message: "Error logging out" });
  }
});

// Token Validation Endpoint
router.post("/validate", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    console.log("Validation failed: No token provided.");
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    // Check if the token is blacklisted
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      console.log("Validation failed: Token is blacklisted.");
      return res.status(403).json({ message: "Token is invalid or blacklisted." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({ message: "Token is valid", user: decoded });
  } catch (err) {
    console.error("Token validation error:", err);

    // Handle token expiration or invalid token
    if (err.name === "TokenExpiredError") {
      console.log("Validation failed: Token has expired.");
      return res.status(403).json({ message: "Token has expired." });
    }

    console.log("Validation failed: Invalid token.");
    return res.status(403).json({ message: "Invalid token." });
  }
});

module.exports = router;
