import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.post("/generate", async (req, res) => {
  try {
    const { context, personality } = req.body;

    if (!context || !personality) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const prompt = `
Generate 3 natural conversation starters.

Context: ${context}
Personality: ${personality}

Format exactly like:

Icebreaker 1:
Follow up:
If awkward:

Icebreaker 2:
Follow up:
If awkward:

Icebreaker 3:
Follow up:
If awkward:

No explanations.
`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
   
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!data.candidates) {
      return res.status(500).json({ error: data });
    }

    const output = data.candidates[0].content.parts[0].text;

    res.json({ output });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/suggest-replies", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const prompt = `
Someone said:
"${message}"

Generate:
- 3 natural follow-up replies
- 1 empathetic reply
- 1 light humorous reply

Format exactly like:

Follow-up 1:
Follow-up 2:
Follow-up 3:
Empathy:
Humor:

No extra explanation.
Keep it realistic and human.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const output = data.candidates[0].content.parts[0].text;

    res.json({ output });

  } catch (error) {
    console.error("Reply Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/practice-chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const prompt = `
You are a friendly AI helping someone practice conversation skills.

User said:
"${message}"

Respond naturally like a real human.
Keep it conversational.
Do not be robotic.
Keep it short (2-4 sentences max).
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: prompt }] }
          ]
        })
      }
    );

    const data = await response.json();
    const output = data.candidates[0].content.parts[0].text;

    res.json({ reply: output });

  } catch (error) {
    console.error("Practice Chat Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});