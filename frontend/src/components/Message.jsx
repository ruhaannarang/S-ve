import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const Message = () => {
  const { user } = useAuth();
  const username = user?.user?.username || "You";

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const listRef = useRef(null);

  useEffect(() => {
    socket.emit("user-joined", username);

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [username]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    const message = {
      id: Date.now(),
      sender: username,
      content: text,
      createdAt: new Date(),
    };

    // show instantly in UI
    setMessages((prev) => [...prev, message]);

    // send to server
    socket.emit("send-message", message);

    setText("");
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>Chat in Public</div>

      <div style={styles.chatWrap}>
        <div style={styles.msgList} ref={listRef}>
          {messages.length === 0 && (
            <div style={styles.empty}>No messages yet — say hi 👋</div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              style={m.sender === username ? styles.msgRowSelf : styles.msgRow}
            >
              <div style={styles.msgAuthor}>{m.sender}</div>
              <div style={styles.msgBubble}>{m.content}</div>
              <div style={styles.msgTime}>
                {new Date(m.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        <form style={styles.inputRow} onSubmit={sendMessage}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
            style={styles.input}
          />

          <button type="submit" style={styles.sendBtn}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
const styles = {
  app: {
    maxWidth: 820,
    margin: "28px auto",
    fontFamily: "Inter, Arial, sans-serif",
  },
  header: { fontSize: 20, fontWeight: 600, marginBottom: 12 },
  chatWrap: {
    border: "1px solid #e6e6e6",
    borderRadius: 8,
    overflow: "hidden",
  },
  msgList: {
    overflowY: "auto",
    padding: 16,
    background: "#fafafa",
    display: "flex",
    flexDirection: "column",
    height: "75vh",
  },
  empty: { color: "#666", textAlign: "center", marginTop: 60 },
  msgRow: {
    marginBottom: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  msgRowSelf: {
    marginBottom: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  msgAuthor: { fontSize: 12, color: "#666", marginBottom: 4 },
  msgBubble: {
    maxWidth: "78%",
    padding: "10px 12px",
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  msgTime: { fontSize: 11, color: "#999", marginTop: 4 },
  inputRow: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderTop: "1px solid #eee",
    background: "#fff",
  },
  input: {
    flexGrow: 1,
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  sendBtn: {
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
};
export default Message;
