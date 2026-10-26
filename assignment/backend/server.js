const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { fillIfEmpty } = require("./seed");
const products = require("./routes/products");
const orders = require("./routes/orders");
const users = require("./routes/users");
const dashboard = require("./routes/dashboard");

const app = express();
const PORT = process.env.PORT || 5000;

// The shop and the admin are separate websites, so the browser needs permission to call this API.
app.use(cors());
app.use(express.json());

function start() {
  if (!global.starting) {
    global.starting = connectDB().then(() => fillIfEmpty());
  }
  return global.starting;
}

app.use((req, res, next) => {
  start()
    .then(() => next())
    .catch((error) => {
      console.log(error.message);
      res.status(500).json({ message: "Could not connect to MongoDB Atlas." });
    });
});

app.get("/", (req, res) => {
  res.json({ message: "Shop backend is running" });
});

app.use("/api/products", products);
app.use("/api/orders", orders);
app.use("/api/users", users);
app.use("/api/dashboard", dashboard);

if (!process.env.VERCEL) {
  start()
    .then(() => {
      app.listen(PORT, () => {
        console.log("Backend running at http://localhost:" + PORT);
      });
    })
    .catch((error) => {
      console.log("Could not connect to MongoDB Atlas.");
      console.log(error.message);
    });
}

module.exports = app;
