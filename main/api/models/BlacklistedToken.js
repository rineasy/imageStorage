const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true }, // Match the token's expiration
});

module.exports = mongoose.model("BlacklistedToken", blacklistedTokenSchema);