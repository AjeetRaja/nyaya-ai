import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // 🔥 Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🔥 Typing Animation
  const typeMessage = (text) => {
    let index = 0;
    let currentText = "";

    const interval = setInterval(() => {
      if (index < text.length) {
        currentText += text[index];
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = currentText;
          return updated;
        });
        index++;
      } else {
        clearInterval(interval);
        setLoading(false);
      }
    }, 20);
  };

  const handleAsk = async () => {
    if (!query.trim()) return;

    const userMessage = { type: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setQuery("");

    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: query }),
      });

      const data = await response.json();

      // Add empty AI message
      setMessages((prev) => [...prev, { type: "ai", text: "" }]);

      setTimeout(() => {
        typeMessage(data.answer);
      }, 300);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "⚠️ Backend connection failed." },
      ]);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>⚖ Nyaya AI</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Chat Card */}
      <div style={styles.card}>
        <div style={styles.chatArea}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                ...(msg.type === "user"
                  ? styles.userMessage
                  : styles.aiMessage),
              }}
            >
              {msg.text}
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div style={styles.aiMessage}>
              Typing...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder="Type your legal question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            style={styles.input}
          />
          <button onClick={handleAsk} style={styles.askBtn}>
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f6f9",
    display: "flex",
    flexDirection: "column",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "#1f2937",
    color: "white",
  },

  logo: {
    margin: 0,
    color: "#f5c542",
  },

  logoutBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    background: "#f5c542",
    cursor: "pointer",
    fontWeight: "bold",
  },

  card: {
    flex: 1,
    margin: "30px auto",
    width: "90%",
    maxWidth: "900px",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    background: "white",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
  },

  chatArea: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "20px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
  },

  message: {
    padding: "14px 18px",
    borderRadius: "18px",
    marginBottom: "12px",
    maxWidth: "70%",
    lineHeight: "1.5",
  },

  userMessage: {
    alignSelf: "flex-end",
    background: "#f5c542",
    color: "#000",
  },

  aiMessage: {
    alignSelf: "flex-start",
    background: "#e5e7eb",
    color: "#000",
  },

  inputArea: {
    display: "flex",
    gap: "12px",
  },

  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
  },

  askBtn: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#f5c542",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Dashboard;