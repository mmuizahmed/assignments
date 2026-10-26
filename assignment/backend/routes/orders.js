const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not load orders" });
  }
});

router.post("/", async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (items.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    let subtotal = 0;
    let quantity = 0;
    const cleanItems = items.map((item) => {
      const price = Number(item.price) || 0;
      const itemQuantity = Math.max(1, Number(item.quantity) || 1);
      subtotal += price * itemQuantity;
      quantity += itemQuantity;
      return {
        name: item.name,
        price,
        quantity: itemQuantity,
        size: item.size || "",
        color: item.color || "",
        image: item.image || "",
      };
    });

    const discount = Math.round(subtotal * 0.2);
    const deliveryFee = 15;
    const total = subtotal - discount + deliveryFee;
    const count = await Order.countDocuments();

    const order = await Order.create({
      number: String(790955 + count),
      customer: String(req.body.customer || "Guest").trim() || "Guest",
      branch: "Online",
      payment: "Card",
      quantity,
      status: "Pending",
      items: cleanItems,
      subtotal,
      discount,
      deliveryFee,
      total,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Could not save order" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Could not update order" });
  }
});

module.exports = router;
