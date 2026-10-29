const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Could not load products" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Could not load product" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const price = Number(req.body.price);
    if (!name || !price) {
      res.status(400).json({ message: "Name and price are required" });
      return;
    }

    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slug) slug = String(Date.now());

    const existing = await Product.findOne({ slug });
    if (existing) slug = slug + "-" + Date.now();

    const image = req.body.image || "products/tape-details-large.png";
    const product = await Product.create({
      slug,
      name,
      description: name,
      price,
      rating: 4,
      reviews: 0,
      image,
      cartImage: image,
      category: "Fashion",
      productType: req.body.productType || "T-shirts",
      gender: "Male",
      colors: ["Black"],
      sizes: ["Small", "Medium", "Large", "X-Large"],
      style: "Casual",
      home: "",
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Could not save product" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete product" });
  }
});

module.exports = router;
