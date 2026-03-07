import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import Nav from "./Nav";
const socket = io("http://localhost:3000");

const Message = () => {
  const { user } = useAuth();
  if (!user) {
    return <div>Loading...</div>;
  }
  console.log(user);
  const username = user.user.username;
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const listRef = useRef(null);

  useEffect(() => {
    socket.emit("user-joined", username);

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user-joined", (user) => {
      const joinMessage = {
        id: Date.now(),
        sender: "system",
        content: `${user} joined the chat`,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, joinMessage]);
    });
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });
    socket.on("user-left", (user) => {
      const leaveMessage = {
        id: Date.now(),
        sender: "system",
        content: `${user} left the chat`,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, leaveMessage]);
    });
    return () => {
      socket.off("receive-message");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("online-users");
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
      <Nav />
      <h1 style={styles.header}>Chat in Public</h1>

      <div style={styles.onlineBox}>
        <strong>Online Users:</strong>
        {onlineUsers.map((u, i) => (
          <span key={i} style={styles.userTag}>
            {u}
          </span>
        ))}
      </div>
      <div style={styles.chatWrap}>
        <div style={styles.msgList} ref={listRef}>
          {messages.length === 0 && (
            <div style={styles.empty}>No messages yet — say hi 👋</div>
          )}

          {messages.map((m) => {
            if (m.sender === "system") {
              return (
                <div key={m.id} style={styles.systemMsg}>
                  {m.content}
                </div>
              );
            }

            return (
              <div
                key={m.id}
                style={
                  m.sender === username ? styles.msgRowSelf : styles.msgRow
                }
              >
                <div style={styles.msgAuthor}>{m.sender}</div>
                <div style={styles.msgBubble}>{m.content}</div>
                <div style={styles.msgTime}>
                  {new Date(m.createdAt).toLocaleTimeString()}
                </div>
              </div>
            );
          })}
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
    // margin: "28px auto",
    background: "rgb(21, 25, 25)",
    color: "#d7faff",
    height:"100%",
    fontFamily: "cursive",
  },
  header: { fontSize: "xx-large", padding: "15px 0 5px 0", fontWeight: 600, marginBottom: 12 , textAlign:"center", color: "#d7faff"},
  chatWrap: {
    border: "1px solid #333",
    borderRadius: 8,
    overflow: "hidden",
    background: "rgb(21, 25, 25)",
  },
  onlineBox: {
    padding: "10px",
    borderBottom: "1px solid #333",
    background: "rgb(21, 25, 25)",
    color: "#d7faff",
  },

  userTag: {
    marginLeft: "8px",
    padding: "4px 8px",
    borderRadius: "6px",
    background: "#333",
    color: "#d7faff",
    fontSize: "12px",
  },
  systemMsg: {
    textAlign: "center",
    color: "#d7faff",
    fontSize: "19px",
    margin: "10px 0",
    border: "2px solid #555",
    borderRadius: 6,
  },
  msgList: {
    overflowY: "auto",
    padding: 16,
    background: "rgb(21, 25, 25)",
    display: "flex",
    flexDirection: "column",
    height: "60vh",
  },
  empty: { color: "#888", textAlign: "center", marginTop: 60 },
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
  msgAuthor: { fontSize: 12, color: "#888", marginBottom: 4 },
  msgBubble: {
    maxWidth: "78%",
    padding: "10px 12px",
    borderRadius: 12,
    background: "#333",
    color: "#d7faff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  msgTime: { fontSize: 11, color: "#888", marginTop: 4 },
  inputRow: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderTop: "1px solid #333",
    background: "rgb(21, 25, 25)",
  },
  input: {
    flexGrow: 1,
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #555",
    background: "#333",
    color: "#d7faff",
  },
  sendBtn: {
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    background: "#d7faff",
    color: "rgb(21, 25, 25)",
    cursor: "pointer",
  },
};
export default Message;
