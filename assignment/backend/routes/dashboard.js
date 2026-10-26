const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// Adds up the orders so the admin dashboard can show real numbers.
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    const earning = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const now = new Date();
    const monthCount = orders.filter((order) => {
      const date = new Date(order.createdAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    const months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (const order of orders) {
      const month = new Date(order.createdAt).getMonth();
      months[month] += order.total || 0;
    }

    res.json({
      earning,
      income: earning,
      orderCount: orders.length,
      monthCount,
      months,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not load dashboard" });
  }
});

module.exports = router;
