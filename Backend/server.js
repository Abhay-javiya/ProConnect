const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware ...
app.use(cors());
app.use(express.json());

const start = async () => {
  const connectMongoDB = await mongoose.connect(process.env.MONGO_URL);

  app.listen(process.env.PORT, () => {
    console.log("Server start at 3000");
  });
};

start();
