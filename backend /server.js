import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./db.js";

dotenv.config();

const app = express();

/* =========================
   Middleware
========================= */
app.use(cors());
app.use(express.json());

console.log("✅ Database ready!");

/* =========================
   Auth Middleware
========================= */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid token format." });
  }

  try {
    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

/* =========================
   Base Route
========================= */
app.get("/", (req, res) => {
  res.send("🚀 Backend running successfully");
});

/* =========================
   Signup
========================= */
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const data = db.read();
    const existingUser = data.users.find((u) => u.email === email);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      history: [],
    };

    data.users.push(newUser);
    db.write(data);

    res.json({ message: "User created successfully." });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Signup failed." });
  }
});

/* =========================
   Login
========================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = db.read();
    const user = data.users.find((u) => u.email === email);

    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Wrong password." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Login failed." });
  }
});

/* =========================
   Check Auth
========================= */
app.get("/me", authMiddleware, (req, res) => {
  try {
    const data = db.read();
    const user = data.users.find((u) => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

/* =========================
   Generate Icebreakers
========================= */
app.post("/generate", async (req, res) => {
  try {
    const { context, personality } = req.body;

    if (!context || !personality) {
      return res.status(400).json({ error: "Missing fields." });
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

    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    const data = await aiResponse.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error("Gemini Error:", data);
      return res.status(500).json({ error: "AI generation failed." });
    }

    const output = data.candidates[0].content.parts[0].text;

    res.json({ output });
  } catch (err) {
    console.error("Generate Error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

/* =========================
   Practice Chat
========================= */
app.post("/practice-chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const prompt = `
You are a friendly AI helping someone practice conversation skills.

User said:
"${message}"

Respond naturally.
Keep it short (2-4 sentences max).
`;

    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    const data = await aiResponse.json();

    if (!data.candidates) {
      return res.status(500).json({ error: "AI generation failed." });
    }

    const reply = data.candidates[0].content.parts[0].text;

    // Save chat history
    const dbData = db.read();
    const user = dbData.users.find((u) => u.id === req.user.id);

    if (user) {
      user.history.push({
        userMessage: message,
        aiReply: reply,
        date: new Date().toISOString(),
      });

      db.write(dbData);
    }

    res.json({ reply });
  } catch (err) {
    console.error("Practice Chat Error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

/* =========================
   Get History
========================= */
app.get("/history", authMiddleware, (req, res) => {
  try {
    const data = db.read();
    const user = data.users.find((u) => u.id === req.user.id);

    res.json(user?.history || []);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch history." });
  }
});

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
