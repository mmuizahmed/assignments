const mongoose = require("mongoose");

// An order is created when a customer checks out on the shop.
const orderSchema = new mongoose.Schema(
  {
    number: String,
    customer: String,
    branch: String,
    payment: String,
    quantity: Number,
    status: { type: String, default: "Pending" },
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
        size: String,
        color: String,
        image: String,
      },
    ],
    subtotal: Number,
    discount: Number,
    deliveryFee: Number,
    total: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
