import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import bnsModel from "./models/bns.model.js";
import { askAI } from "./ai.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow all origins (important for Render production)
app.use(cors());

// ✅ Parse JSON
app.use(express.json());

// ✅ Rate limit for /ask
app.use("/ask", rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: "Too many requests. Please try later."
}));

// ✅ Root check
app.get("/", (req, res) => {
  res.send("⚖️ Nyaya AI Node Server Running");
});

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Nyaya AI Backend" });
});

// ✅ ASK ROUTE
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        answer: "Provide a valid legal question."
      });
    }

    // 🔎 Extract section number from question
    const sectionMatch = question.match(/\d+/);

    if (sectionMatch) {
      const sectionNumber = sectionMatch[0];

      // ✅ Corrected model usage
      const dbResult = await bnsModel.findOne({ section: sectionNumber });

      if (dbResult) {
        return res.json({ answer: dbResult.answer });
      }
    }

    // 🔁 Fallback to FastAPI (change this if deployed)
    const response = await fetch("http://localhost:8002/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    if (!response.ok) {
      throw new Error("FastAPI server error");
    }

    const data = await response.json();
    return res.json(data);

  } catch (error) {
    console.error("FULL ERROR:", error);
    return res.status(500).json({
      answer: "Internal server error. Try again later."
    });
  }
});

// ✅ Add BNS sections route
app.post("/add-bns", async (req, res) => {
  try {
    const sections = await bnsModel.insertMany(req.body);
    res.json({
      message: "BNS Sections added successfully",
      data: sections
    });
  } catch (error) {
    console.error("BNS Insert Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Node Server running on port ${PORT}`);
});