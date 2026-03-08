import React, { useRef,useEffect } from "react";
import Nav from "./Nav";
import { useAuth } from "../context/AuthContext";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
const ENDPOINT = "http://localhost:3000/chat";
const AiChat = () => {
  const messagesEndRef = useRef(null);
  const { user, loading } = useAuth();
  console.log(loading);
  const username = user?.user?.username;
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    const createChat = async () => {
      const res = await fetch("http://localhost:3000/new-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.user?._id }),
      });

      const data = await res.json();
      localStorage.setItem("chatId", data._id);
    };

    if (!localStorage.getItem("chatId")) {
      createChat();
    }
  }, []);
  const { messages, sendMessage, error, status } = useChat({
    transport: new DefaultChatTransport({
      api: ENDPOINT,
      prepareSendMessagesRequest: ({ messages }) => {
        return {
          body: {
            chatId: localStorage.getItem("chatId"),
            messages: messages,
          },
        };
      },
    }),
  });
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className="chatappbody">
      <Nav />
      <div className="line"></div>
      <div className="chatpage">
        <span>
          <h2 className="chatheading">Chat with S+ AI</h2>
        </span>
        <div className="chatapp">
          <div className="message-box">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={
                    message.role === "user" ? "user-message" : "bot-message"
                  }
                >
                  {message.role === "user" ? username : "ChatBot"}
                </div>
                <p>
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <span key={index}>{part.text}</span>
                    ) : null,
                  )}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage({
                text: e.currentTarget["input-prompt"].value,
                role: "user",
              });
              e.currentTarget.reset();
            }}
            className="inputform"
          >
            <input type="text" name="message" id="input-prompt" />
            <button
              id="chatsendbtn"
              type="submit"
              disabled={status === "streaming"}
            >
              send
            </button>
          </form>
          {error && (
            <p className="errorbox">
              Service currently unavailable. Please try again later.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiChat;
