// ai.js
// Node 22+ has built-in fetch, so no node-fetch needed

const AI_API_URL = process.env.AI_API_URL || "http://localhost:11434/api/generate";

export async function askAI(question) {
  try {
    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi",
        prompt: question,
        stream: false
      })
    });

    if (!response.ok) throw new Error("AI API error");

    const data = await response.json();

    console.log("FULL RESPONSE:", data);
    console.log("ANSWER:", data.response);

    return data.response;

  } catch (error) {
    console.error("AI CALL ERROR:", error);
    return "AI service unavailable. Try later.";
  }
}