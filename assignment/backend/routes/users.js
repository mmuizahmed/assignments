const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ code: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Could not load users" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Could not update user" });
  }
});

module.exports = router;
