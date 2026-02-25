// Load environment variables
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();

// ===== Middleware =====
app.use(cors({
  origin: "http://Z:3000",
}));

app.use(express.json());

// ===== Rate Limiter =====
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: "Too many requests. Please try again later."
});

app.use("/ask", limiter);

// ===== Check API Key =====


// ===== OpenAI Setup =====

// ===== Ask Route =====
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        answer: "Please provide a valid legal question."
      });
    }

    const response = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    res.json(data);

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({
      answer: "Internal server error. Please try again later."
    });
  }
});

// ===== Start Server =====
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`✅ Nyaya AI Server running on http://localhost:${PORT}`);
});
