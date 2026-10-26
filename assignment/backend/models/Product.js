const mongoose = require("mongoose");

// One product is used by both the shop and the admin panel.
const productSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  name: String,
  description: String,
  price: Number,
  oldPrice: Number,
  discount: String,
  rating: Number,
  reviews: Number,
  image: String,
  homeImage: String,
  cartImage: String,
  category: String,
  productType: String,
  gender: String,
  colors: [String],
  sizes: [String],
  style: String,
  home: String,
});

module.exports = mongoose.model("Product", productSchema);
