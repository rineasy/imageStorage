const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // Reference to the user
  url: { type: String, required: true }, // URL of the uploaded image
});

module.exports = mongoose.model("Image", imageSchema);
