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
   TRUST DEPLOYMENT PROXY

   Useful when the backend is later hosted behind
   Render, Railway, or another reverse proxy.
========================================================= */

app.set("trust proxy", 1);

/* =========================================================
   ALLOWED FRONTEND ORIGINS

   Supports:
   CLIENT_URLS=http://localhost:5173,https://yourdomain.com

   CLIENT_URL is still supported for compatibility.
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
      /*
        Allow requests without an Origin header,
        such as health checks or API tools.
      */

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
   ROUTES
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
