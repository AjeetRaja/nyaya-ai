import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import bnsModel from "../models/bns.model.js";

const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/ask", rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: "Too many requests. Please try later."
}));

app.get("/", (req, res) => res.send("⚖️ Nyaya AI Node Server Running"));
app.get("/health", (req, res) => res.json({ status: "OK", service: "Nyaya AI Backend" }));

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ answer: "Provide a valid legal question." });
    const sectionMatch = question.match(/\d+/);

if (sectionMatch) {
  const sectionNumber = sectionMatch[0];

  const dbResult = await BnsSection.findOne({ section: sectionNumber });

  if (dbResult) {
    return res.json({ answer: dbResult.answer });
  }
}

    const response = await fetch("http://localhost:8002/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    if (!response.ok) throw new Error("FastAPI server error");

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ answer: "Internal server error. Try again later." });
  }
});

// Optional: MongoDB add sections route
app.post("/add-bns", async (req, res) => {
  try {
    const sections = await BnsSection.insertMany(req.body);
    res.json({ message: "BNS Sections added successfully", data: sections });
  } catch (error) {
    console.error("BNS Insert Error:", error);
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

app.listen(PORT, () => console.log(`✅ Node Server running on http://localhost:${PORT}`));