const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user.route");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware ...
app.use(cors());
app.use(express.json());

// Routes ...
app.use(userRoutes);

// Start Server ...
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

start();
