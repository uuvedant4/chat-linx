const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB.js");
const User = require("./models/User.js");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ username, password: hashedPassword });
    jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      {},
      (error, token) => {
        if (error) {
          throw error;
        }
        res.cookie("token", token).status(201).json({
          id: user._id,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

connectDB();
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);
