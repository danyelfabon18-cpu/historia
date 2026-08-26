import { rateLimit } from "express-rate-limit";

/* =========================================================
   ADMIN LOGIN LIMITER

   Limits repeated login attempts.
   Successful logins are not counted.
========================================================= */

export const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  skipSuccessfulRequests: true,

  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
});

/* =========================================================
   NEW CONVERSATION LIMITER

   This limits NEW conversation creation only.

   It does NOT mean visitors can only send
   10 chat messages.
========================================================= */

export const newConversationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,

  limit: 10,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many new conversations were started from this connection. Please try again later.",
  },
});

/* =========================================================
   CHAT MESSAGE LIMITER

   30 messages per minute is enough for a normal
   real-time conversation while blocking rapid spam.
========================================================= */

export const conversationMessageLimiter = rateLimit({
  windowMs: 60 * 1000,

  limit: 30,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "You're sending messages too quickly. Please wait a moment and try again.",
  },
});
