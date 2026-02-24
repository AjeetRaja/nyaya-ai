import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import { sendMessageToAI } from "../services/api";
import "./Chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendMessageToAI(input);

      const aiMessage = { sender: "ai", text: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}

        {loading && <div className="typing">Nyaya-AI is typing...</div>}

        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Indian laws..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chat;