import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("✅ Database ready!");

/* =========================
   Auth Middleware
========================= */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "Access denied. No token." });

  try {
    const token = authHeader.split(" ")[1];
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).json({ error: "Invalid token" });
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
   Forgot Password
========================= */
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ error: "Email required" });

    const data = db.read();
    const user = data.users.find(u => u.email === email);

    if (!user)
      return res.status(404).json({ error: "User not found" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpiry = Date.now() + 10 * 60 * 1000;

    user.resetCode = resetCode;
    user.resetExpiry = resetExpiry;
    db.write(data);

    console.log(`🔑 Reset code for ${email}: ${resetCode}`);

    res.json({ 
      message: "Reset code generated",
      resetCode: resetCode,
      note: "In production, this would be sent via email"
    });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   Reset Password
========================= */
app.post("/reset-password", async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword)
      return res.status(400).json({ error: "All fields required" });

    const data = db.read();
    const user = data.users.find(u => u.email === email);

    if (!user)
      return res.status(404).json({ error: "User not found" });

    if (user.resetCode !== resetCode)
      return res.status(400).json({ error: "Invalid reset code" });

    if (Date.now() > user.resetExpiry)
      return res.status(400).json({ error: "Reset code expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    delete user.resetCode;
    delete user.resetExpiry;
    
    db.write(data);

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   Generate Icebreakers - NO AUTH
========================= */
app.post("/generate", async (req, res) => {
  try {
    const { context, personality } = req.body;

    if (!context || !personality)
      return res.status(400).json({ error: "Missing fields" });

    const prompt = `Generate 3 natural conversation starters for someone with a ${personality} personality in this context: ${context}.

Return ONLY 3 icebreakers, one per line. No numbering, no explanations, just the conversation starters.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      console.error('❌ Gemini API Error:', data);
      return res.status(500).json({ error: "Failed to generate icebreakers", details: data });
    }

    const output = data.candidates[0].content.parts[0].text;
    console.log('✅ Generated icebreakers successfully');

    res.json({ output });

  } catch (error) {
    console.error("❌ Generate Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   Suggest Replies - NO AUTH
========================= */
app.post("/suggest-replies", async (req, res) => { 
  try {
    const { message } = req.body;

    if (!message)
      return res.status(400).json({ error: "Message is required" });

    const prompt = `Someone said: "${message}"

Generate exactly 5 reply options in this format:
1. A natural follow-up question
2. Another natural follow-up  
3. A third follow-up
4. An empathetic response
5. A light humorous response

Return ONLY the 5 replies, one per line, numbered 1-5.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]) {
      console.error('❌ Gemini API Error:', data);
      return res.status(500).json({ error: "Failed to generate replies", details: data });
    }

    const output = data.candidates[0].content.parts[0].text;
    console.log('✅ Generated replies successfully');

    res.json({ output });

  } catch (error) {
    console.error("❌ Reply Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   Practice Chat - NO AUTH
========================= */
app.post("/practice-chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message)
      return res.status(400).json({ error: "Message is required" });

    const prompt = `You are a friendly conversation coach helping someone practice their social skills.

They said: "${message}"

Respond naturally and encouragingly in 2-3 sentences. Be warm, supportive, and help guide the conversation.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]) {
      console.error('❌ Gemini API Error:', data);
      return res.status(500).json({ error: "Failed to generate response", details: data });
    }

    const output = data.candidates[0].content.parts[0].text;
    console.log('✅ Generated chat response successfully');

    res.json({ reply: output });

  } catch (error) {
    console.error("❌ Practice Chat Error:", error);
    res.status(500).json({ error: "Server error" });
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