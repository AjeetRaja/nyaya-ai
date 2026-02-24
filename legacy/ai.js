async function askAI(question) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "phi",
      prompt: question,
      stream: false
    })
  });

  const data = await response.json();

  console.log("FULL RESPONSE:");
  console.log(data);   // 👈 print full response

  console.log("ANSWER:");
  console.log(data.response);
}

askAI("Explain IPC Section 420 in simple words");
