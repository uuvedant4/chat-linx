const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB.js");
const User = require("./models/User.js");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const ws = require("ws");
const Message = require("./models/Message.js");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (error, userData) => {
        if (error) {
          throw error;
        }
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
}

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

app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  if (userId !== null) {
    const userData = await getUserDataFromRequest(req);
    const ourUserId = userData.userId;
    const messages = await Message.find({
      sender: { $in: [userId, ourUserId] },
      recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 });
    res.json(messages);
  }
});

app.get("/people", async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  res.json(users);
});

connectDB();
const server = app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);

const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  const notifyAboutOnlinePeople = () => {
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
  };

  connection.isAlive = true;
  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log("dead");
    }, 1000);
  }, 5000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  // read username and id from the cookie for this connection
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

  connection.on("message", async (message) => {
    messageData = JSON.parse(message.toString());
    const { recipient, text } = messageData;
    if (recipient && text) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
      });

      [...wss.clients]
        .filter((client) => client.userId === recipient)
        .forEach((client) => {
          client.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              _id: messageDoc._id,
            })
          );
        });
    }
  });

  // notify everyone about online users
  notifyAboutOnlinePeople();
});
