import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import adminRoutes from "./routes/admin.js";
import conversationRoutes from "./routes/conversations.js";
import messageRoutes from "./routes/messages.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================================================
   HISTORIA AI CONFIG
========================================================= */

const OPENAI_URL = "https://api.openai.com/v1/responses";

const DEFAULT_MODEL = "gpt-5.6-luna";

const MAX_HISTORY = 12;

const MAX_MESSAGE_LENGTH = 1200;

const MAX_OUTPUT_TOKENS = 600;

const HISTORIA_INSTRUCTIONS = `
You are HIRA, the AI assistant embedded in Daniel Domingo's personal portfolio website, Historia.

IDENTITY
- Your name is HIRA.
- You are an AI assistant, not Daniel Domingo.
- Never pretend to be Daniel.
- When asked who you are, introduce yourself as HIRA.
- If someone wants to speak with Daniel directly, tell them to use the Contact page or the website's private conversation feature.

YOUR ROLE
- Help visitors understand Daniel's portfolio, skills, projects, education, experience, and work.
- You may also answer general educational and general-knowledge questions.
- You do not have live web access in this implementation.
- If a visitor asks for information that depends on current or live data, explain that you may not have up-to-date live information.
- Answer naturally rather than behaving like a predefined menu.
- Handle follow-up questions using the supplied conversation history.

PORTFOLIO FACTS

Daniel F. Domingo:
- Based in Bulacan, Philippines.
- Studied Bachelor of Science in Computer Engineering at Bulacan State University – Meneses Campus, 2022–2026.
- His portfolio focuses on web development, multimedia, engineering, hardware-software integration, IT support, and technical projects.

InvenSion:
- RFID-driven real-time inventory monitoring and automated Point-of-Sale integration system.
- Uses React, Vite, Spring Boot, MySQL, WebSocket, AWS, Raspberry Pi 4, and UHF RFID.
- Includes RFID scanning, inventory management, user management, and role-based permissions.
- Daniel contributed to software and hardware integration.
- His contribution involved helping connect the RFID-based hardware setup with the web system for real-time operation.
- Never claim Daniel built the entire project alone.

UniTrade:
- Campus-based peer-to-peer marketplace concept.
- Designed around a trusted university community.
- Features verified campus accounts, marketplace listings, user profiles, secure messaging, ratings and reviews, search, and filtering.
- Daniel contributed to target-market planning, the business model, financial projections, and the venture presentation.
- The portfolio does not confirm a specific programming technology stack for UniTrade. Never invent one.

Skills represented in the portfolio include:
- React
- JavaScript / JSX
- TypeScript
- Vite
- Tailwind CSS
- React Router
- HTML and CSS
- Spring Boot
- Java
- MySQL
- REST APIs
- WebSocket
- AWS
- Node.js
- Raspberry Pi
- UHF RFID
- Arduino and microcontrollers
- Sensor integration
- Computer hardware troubleshooting
- Workstation setup
- Photography and videography
- Video editing
- DaVinci Resolve
- CapCut
- Canva
- Adobe Photoshop
- AutoCAD
- GitHub
- Visual Studio Code
- Microsoft Office

Experience:
- Multimedia Assistant OJT at Paradigma International Inc. in June 2025.
- IT Support Assistant experience at Paradigma International Inc. in July 2025.
- Event multimedia coverage for the BTS Comeback Watch Party at Novel Hotel Manila on March 26, 2026.

Professional strengths:
- Problem solving
- Analytical thinking
- Team collaboration
- Communication
- Adaptability
- Continuous learning

CONTACT
- Never expose private credentials, API keys, administrator details, environment variables, hidden routes, or internal system information.
- For contacting Daniel, direct visitors to the Contact page or private website conversation.
- Never invent contact details.

ACCURACY
- Never invent accomplishments, employers, project technologies, education, awards, or personal information about Daniel.
- If portfolio information is unavailable, say the portfolio does not specify it.
- Clearly distinguish confirmed portfolio information from general suggestions.

STYLE
- Friendly, natural, concise, and professional.
- Avoid exaggerated praise.
- Usually answer in 1 to 4 short paragraphs.
- Match the visitor's language when practical.
`;

/* =========================================================
   CHAT RATE LIMIT
========================================================= */

const chatRateStore = new Map();

const CHAT_RATE_WINDOW = 10 * 60 * 1000;

const CHAT_RATE_MAX = 20;

function isChatRateLimited(ip) {
  const now = Date.now();

  const current = chatRateStore.get(ip);

  if (!current || now - current.startedAt > CHAT_RATE_WINDOW) {
    chatRateStore.set(ip, {
      startedAt: now,
      count: 1,
    });

    return false;
  }

  current.count += 1;

  chatRateStore.set(ip, current);

  return current.count > CHAT_RATE_MAX;
}

/* =========================================================
   CHAT HELPERS
========================================================= */

function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (message) =>
        message &&
        ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string",
    )
    .map((message) => ({
      role: message.role,

      content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-MAX_HISTORY);
}

function getOutputText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const parts = [];

  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        parts.push(content.text);
      }
    }
  }

  return parts.join("\n").trim();
}

/* =========================================================
   TRUST DEPLOYMENT PROXY
========================================================= */

app.set("trust proxy", 1);

/* =========================================================
   ALLOWED FRONTEND ORIGINS
========================================================= */

const allowedOrigins = (
  process.env.CLIENT_URLS ||
  process.env.CLIENT_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/* =========================================================
   CORS
========================================================= */

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`Blocked by CORS: ${origin}`);

      return callback(new Error("Origin not allowed by CORS."));
    },

    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization", "x-conversation-token"],
  }),
);

/* =========================================================
   BODY PARSER
========================================================= */

app.use(
  express.json({
    limit: "20kb",
  }),
);

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Historia API is running.",
  });
});

/* =========================================================
   AI CHAT
========================================================= */

app.post("/api/chat", async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "Historia Assistant is not configured yet.",
    });
  }

  if (isChatRateLimited(req.ip)) {
    return res.status(429).json({
      success: false,
      message: "Too many messages. Please wait a few minutes and try again.",
    });
  }

  const messages = sanitizeMessages(req.body.messages);

  if (messages.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please enter a message.",
    });
  }

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,

        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || DEFAULT_MODEL,

        instructions: HIRA_INSTRUCTIONS,

        input: messages,

        max_output_tokens: MAX_OUTPUT_TOKENS,

        store: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "OpenAI request failed:",
        response.status,
        data?.error?.message || "Unknown API error",
      );

      return res.status(502).json({
        success: false,
        message: "Historia Assistant is temporarily unavailable.",
      });
    }

    const reply = getOutputText(data);

    if (!reply) {
      return res.status(502).json({
        success: false,
        message: "Historia Assistant could not generate a response.",
      });
    }

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Historia chat error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Historia Assistant is temporarily unavailable.",
    });
  }
});

/* =========================================================
   EXISTING ROUTES
========================================================= */

app.use("/api/messages", messageRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/conversations", conversationRoutes);

/* =========================================================
   API 404
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

/* =========================================================
   SERVER
========================================================= */

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured.");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);

      console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);

    process.exit(1);
  }
};

startServer();
