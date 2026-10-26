const mongoose = require("mongoose");

// Users are the people shown on the admin Users page.
const userSchema = new mongoose.Schema({
  code: String,
  name: String,
  email: String,
  country: String,
  friends: Number,
  followers: Number,
  status: String,
  avatar: String,
  verified: Boolean,
});

module.exports = mongoose.model("User", userSchema);
