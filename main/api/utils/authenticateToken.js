const jwt = require("jsonwebtoken"); // Ensure jwt is imported
const BlacklistedToken = require("../models/BlacklistedToken");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // Check if the token is blacklisted
  try {
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res
        .status(403)
        .json({ message: "Invalid token. Please log in again." });
    }
  } catch (err) {
    console.error("Error checking blacklist:", err);
    return res.status(500).json({ message: "Server error while validating token." });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user information to the request object
    next(); // Proceed to the next middleware or route
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(403)
        .json({ message: "Token expired. Please log in again." });
    }
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = authenticateToken;
