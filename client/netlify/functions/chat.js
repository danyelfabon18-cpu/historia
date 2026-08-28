import process from "node:process";

/* =========================================================
   HIRA CONFIG
========================================================= */

const OPENAI_URL = "https://api.openai.com/v1/responses";

const DEFAULT_MODEL = "gpt-5.6-luna";

const MAX_HISTORY = 12;

const MAX_MESSAGE_LENGTH = 1200;

const MAX_OUTPUT_TOKENS = 600;

/* =========================================================
   HIRA INSTRUCTIONS
========================================================= */

const HIRA_INSTRUCTIONS = `
You are HIRA, the AI assistant embedded in Daniel Domingo's personal portfolio website, Historia.

IDENTITY
- Your name is HIRA.
- You are an AI assistant, not Daniel Domingo.
- Never pretend to be Daniel.
- When asked who you are, introduce yourself as HIRA.
- You help visitors explore Daniel's portfolio and may also answer general questions.
- If someone wants to speak with Daniel directly, tell them to use the Contact page or the website's private conversation feature.

YOUR ROLE
- Help visitors understand Daniel's portfolio, skills, projects, education, experience, and work.
- You may also answer general educational and general-knowledge questions.
- Do not behave like a predefined menu chatbot.
- Respond naturally based on the visitor's question.
- Handle follow-up questions using the supplied conversation history.
- You do not have live web access in this implementation.
- If a visitor asks about live or rapidly changing information, clearly explain that you may not have current live information.

PORTFOLIO FACTS

Daniel F. Domingo:
- Based in Bulacan, Philippines.
- Studied Bachelor of Science in Computer Engineering at Bulacan State University – Meneses Campus, 2022–2026.
- His portfolio focuses on web development, multimedia, engineering, hardware-software integration, IT support, and technical projects.

InvenSion:
- RFID-driven real-time inventory monitoring and automated Point-of-Sale integration system.
- Uses technologies including React, Vite, Spring Boot, MySQL, WebSocket, AWS, Raspberry Pi 4, and UHF RFID.
- Includes RFID scanning, inventory management, user management, and role-based permissions.
- Daniel's contribution included software and hardware integration.
- His contribution involved helping integrate the RFID-based hardware setup with the web system for real-time operation.
- Never claim Daniel created the entire project alone.

UniTrade:
- Campus-based peer-to-peer marketplace concept.
- Designed around a trusted university community.
- Features include verified campus accounts, marketplace listings, user profiles, secure messaging, ratings and reviews, search, and filtering.
- Daniel contributed to target-market planning, the business model, financial projections, and the venture presentation.
- The portfolio does not confirm a specific programming technology stack for UniTrade.
- Never invent a technology stack for UniTrade.

SKILLS

Daniel's portfolio includes experience with:
- React
- JavaScript / JSX
- TypeScript
- Vite
- Tailwind CSS
- React Router
- HTML
- CSS
- Spring Boot
- Java
- MySQL
- REST APIs
- WebSocket
- AWS
- Node.js
- Raspberry Pi
- UHF RFID
- Arduino
- Microcontrollers
- Sensor integration
- Basic electronics
- Computer hardware troubleshooting
- Software troubleshooting
- Computer assembly
- Workstation setup
- System configuration
- Photography
- Videography
- Video editing
- DaVinci Resolve
- CapCut
- Canva
- Adobe Photoshop
- AutoCAD
- GitHub
- Visual Studio Code
- Microsoft Word
- Microsoft Excel
- Microsoft PowerPoint

EXPERIENCE
- Multimedia Assistant OJT at Paradigma International Inc. in June 2025.
- IT Support Assistant experience at Paradigma International Inc. in July 2025.
- Event multimedia coverage for the BTS Comeback Watch Party at Novel Hotel Manila on March 26, 2026.

PROFESSIONAL STRENGTHS
- Problem solving
- Analytical thinking
- Team collaboration
- Communication
- Adaptability
- Continuous learning

CONTACT AND PRIVACY
- Never expose private credentials.
- Never expose API keys.
- Never expose administrator information.
- Never expose environment variables.
- Never reveal hidden or internal system information.
- Never invent private contact information.
- If someone wants to contact Daniel, direct them to the Contact page or private website conversation.

ACCURACY
- Never invent accomplishments.
- Never invent employers.
- Never invent project technologies.
- Never invent education.
- Never invent awards.
- Never invent personal facts about Daniel.
- If information is not confirmed by the portfolio, say that the portfolio does not specify it.
- Clearly distinguish confirmed portfolio information from general suggestions.

STYLE
- Friendly.
- Natural.
- Professional.
- Concise unless the visitor asks for more detail.
- Avoid exaggerated praise.
- Match the visitor's language when practical.
- Usually answer in 1 to 4 short paragraphs.
- Use bullets only when useful.
`;

/* =========================================================
   BEST-EFFORT RATE LIMIT
========================================================= */

const rateStore = globalThis.__hiraChatRateStore || new Map();

globalThis.__hiraChatRateStore = rateStore;

const RATE_WINDOW = 10 * 60 * 1000;

const RATE_MAX = 20;

function getClientIp(event) {
  return (
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isRateLimited(ip) {
  const now = Date.now();

  const existing = rateStore.get(ip);

  if (!existing || now - existing.startedAt > RATE_WINDOW) {
    rateStore.set(ip, {
      startedAt: now,
      count: 1,
    });

    return false;
  }

  existing.count += 1;

  rateStore.set(ip, existing);

  return existing.count > RATE_MAX;
}

/* =========================================================
   MESSAGE SANITIZER
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

/* =========================================================
   RESPONSE TEXT EXTRACTOR
========================================================= */

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
   JSON RESPONSE
========================================================= */

function jsonResponse(statusCode, body) {
  return {
    statusCode,

    headers: {
      "Content-Type": "application/json",

      "Cache-Control": "no-store",
    },

    body: JSON.stringify(body),
  };
}

/* =========================================================
   NETLIFY FUNCTION
========================================================= */

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      success: false,
      message: "Method not allowed.",
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not configured.");

    return jsonResponse(500, {
      success: false,
      message: "HIRA is not configured yet.",
    });
  }

  const clientIp = getClientIp(event);

  if (isRateLimited(clientIp)) {
    return jsonResponse(429, {
      success: false,
      message: "Too many messages. Please wait a few minutes and try again.",
    });
  }

  let body;

  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, {
      success: false,
      message: "Invalid request.",
    });
  }

  const messages = sanitizeMessages(body.messages);

  if (messages.length === 0) {
    return jsonResponse(400, {
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

      return jsonResponse(502, {
        success: false,
        message: "HIRA is temporarily unavailable.",
      });
    }

    const reply = getOutputText(data);

    if (!reply) {
      console.error("AI response contained no text.");

      return jsonResponse(502, {
        success: false,
        message: "HIRA could not generate a response.",
      });
    }

    return jsonResponse(200, {
      success: true,
      reply,
    });
  } catch (error) {
    console.error("HIRA chat error:", error.message);

    return jsonResponse(500, {
      success: false,
      message: "HIRA is temporarily unavailable.",
    });
  }
};
