const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_CONNECTION_URI)
    .then(() => {
      console.log("Database connection successful.");
    })
    .catch((error) => console.log(error.message));
};

module.exports = connectDB;
