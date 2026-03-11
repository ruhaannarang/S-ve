const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const generateText = require("ai");
const { streamText, convertToModelMessages } = require("ai");
const { google } = require("@ai-sdk/google");
const connectDB = require("./db");
const Posts = require("./models/Posts");
const Message = require("./models/Message");
const mongoose = require("mongoose");
const Chat = require("./models/Chat");

const app = express();
dotenv.config();

connectDB();

app.use(
  cors({
    origin: "https://s-ve-frontend.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

/* ---------------- HTTP SERVER ---------------- */

const server = http.createServer(app);
const onlineUsers = new Set();
/* ---------------- SOCKET SERVER ---------------- */

const io = new Server(server, {
  cors: {
    origin: "https://s-ve-frontend.onrender.com",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("user-joined", (username) => {
    socket.username = username; // store username in socket
    onlineUsers.add(username);
    console.log(`${username} joined the chat`);

    socket.broadcast.emit("user-joined", username);
    io.emit("online-users", Array.from(onlineUsers));
  });

  socket.on("send-message", (message) => {
    socket.broadcast.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      onlineUsers.delete(socket.username);
      io.emit("user-left", socket.username);
      io.emit("online-users", Array.from(onlineUsers));
      console.log(`${socket.username} left the chat`);
    }
  });
});

app.post("/addpost", (req, res) => {
  console.log(req.body);
  const { username, caption, image } = req.body;
  const newPost = new Posts({
    username,
    caption,
    image,
  });
  newPost.save();
  res.send("Post added successfully");
});

app.get("/getposts", async (req, res) => {
  try {
    const posts = await Posts.find({});
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching posts");
  }
});
app.get("/ping", (req, res) => {
  res.send("Server awake");
});
app.post("/chat", async (req, res) => {
  try {
    const { chatId, messages } = req.body;

    // 🛑 Validate chatId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ error: "Invalid chatId" });
    }

    // 🧠 Find latest USER message from SDK array
    const latestUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");

    let userText = "";

    // Handle all SDK formats
    if (typeof latestUserMessage?.content === "string") {
      userText = latestUserMessage.content;
    } else if (Array.isArray(latestUserMessage?.content)) {
      userText = latestUserMessage.content.map((c) => c.text || "").join("");
    } else if (Array.isArray(latestUserMessage?.parts)) {
      // Gemini format
      userText = latestUserMessage.parts.map((p) => p.text || "").join("");
    }

    console.log("EXTRACTED USER TEXT:", userText);

    if (!userText.trim()) {
      return res.status(400).json({ error: "Empty message" });
    }

    // 1️⃣ Fetch old memory from DB
    const oldMessages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .limit(15);

    // 2️⃣ Save user message
    await Message.create({
      chatId,
      role: "user",
      content: userText,
    });

    // 3️⃣ Prepare full conversation for AI
    const allMessages = [
      ...oldMessages.map((m) => ({
        role: m.role,
        content: m.content || "",
      })),
      { role: "user", content: userText },
    ].filter((m) => m.content && m.content.trim() !== "");

    // 4️⃣ AI call
    const result = await streamText({
      model: google("gemini-2.5-flash-lite"),
      system:
        "You are a helpful assistant integrated into a social media app called S+  and you have to answer all the questions that are asked. Maintain a positive and supportive tone throughout the interaction.give responsive and concise answers.if anyone ask who made you you have to say Mr Ruhaan is my developer and S+ is the best social media app in the world.",
      messages: allMessages,
    });

    const aiReplyPromise = result.text;

    result.pipeUIMessageStreamToResponse(res);

    const aiReply = await aiReplyPromise;

    await Message.create({
      chatId,
      role: "assistant",
      content: aiReply,
    });

    // 6️⃣ Send response back to frontend
    // res.json({ reply: aiReply });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

// app.post("/test-message", async (req, res) => {
//   const { chatId, text } = req.body;

//   const msg = await Message.create({
//     chatId,
//     role: "user",
//     content: text
//   });

//   res.json(msg);
// });
app.post("/new-chat", async (req, res) => {
  const { userId } = req.body;

  const chat = await Chat.create({ userId });

  res.json(chat);
});
const path = require("path");

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
const port = 3000;
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
