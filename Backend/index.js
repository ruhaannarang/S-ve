const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const generateText = require("ai");
const { streamText, convertToModelMessages } = require("ai");
const { google } = require("@ai-sdk/google");
const Posts = require("./models/posts");
const Message = require("./models/Message");
const mongoose = require("mongoose");
const Chat = require("./models/Chat");
const router = require("./routes/auth");
const app = express();
connectDB();
dotenv.config();
app.use(cors());
const port = 3000;

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));

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
// app.post("/chat", async (req, res) => {
//   const messages = await convertToModelMessages(req.body.messages); // ✅ FIX 1

//   const result = await streamText({
//     model: google("gemini-2.5-flash-lite"),
//     system: "You are a helpful assistant integrated into a social media app called S+ that allows users to share posts and interact with an AI chatbot. Engage in friendly and informative conversations with users, providing assistance related to social media usage, content creation, and general inquiries. Maintain a positive and supportive tone throughout the interaction.give responsive and concise answers.",
//     messages: messages,
//   });

//   result.pipeUIMessageStreamToResponse(res);
// });
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
      system: "...",
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
