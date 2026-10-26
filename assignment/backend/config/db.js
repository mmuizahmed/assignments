const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");

function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Add MONGODB_URI to the .env file");
  }
  return mongoose.connect(uri);
}

module.exports = { connectDB };
