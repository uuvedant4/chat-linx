const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB.js");
const User = require("./models/User.js");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const ws = require("ws");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ username, password: hashedPassword });
    jwt.sign(
      { userId: user._id, username },
      process.env.JWT_SECRET_KEY,
      {},
      (error, token) => {
        if (error) {
          throw error;
        }
        res
          .cookie("token", token, { secure: true, sameSite: "none" })
          .status(201)
          .json({
            id: user._id,
          });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (error, userData) => {
      if (error) {
        throw error;
      }
      res.json(userData);
    });
  } else {
    res.status(401).json("No token");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json("Invalid credentials.");
  } else {
    jwt.sign(
      { userId: user._id, username },
      process.env.JWT_SECRET_KEY,
      {},
      (error, token) => {
        if (error) {
          throw error;
        }
        res.cookie("token", token, { secure: true, sameSite: "none" });
        res.status(200).json({ id: user._id });
      }
    );
  }
});

connectDB();
const server = app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);

const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token"));
    if (tokenCookieString) {
      const token = tokenCookieString.slice(6).trimLeft();
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (error, userData) => {
          if (error) {
            throw error;
          }
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((person) => ({
          userId: person.userId,
          username: person.username,
        })),
      })
    );
  });
});
