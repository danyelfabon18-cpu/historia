import crypto from "crypto";
import express from "express";

import Conversation from "../models/Conversation.js";
import adminAuth from "../middleware/adminAuth.js";

import {
  conversationMessageLimiter,
  newConversationLimiter,
} from "../middleware/rateLimits.js";

const router = express.Router();

/* =========================================================
   HELPERS
========================================================= */

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createVisitorToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const hashVisitorToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const getVisitorToken = (req) => {
  return req.headers["x-conversation-token"];
};

const verifyVisitorAccess = async (conversationId, visitorToken) => {
  if (!visitorToken) {
    return null;
  }

  const tokenHash = hashVisitorToken(visitorToken);

  const conversation =
    await Conversation.findById(conversationId).select("+visitorTokenHash");

  if (!conversation) {
    return null;
  }

  if (conversation.visitorTokenHash !== tokenHash) {
    return null;
  }

  return conversation;
};

/* =========================================================
   PUBLIC — CREATE CONVERSATION
========================================================= */

router.post("/", newConversationLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const cleanName = typeof name === "string" ? name.trim() : "";

    const cleanEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    const cleanSubject = typeof subject === "string" ? subject.trim() : "";

    const cleanMessage = typeof message === "string" ? message.trim() : "";

    if (!cleanName || !cleanEmail || !cleanSubject || !cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "Please complete all fields.",
      });
    }

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name is too long.",
      });
    }

    if (cleanSubject.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Subject is too long.",
      });
    }

    if (cleanMessage.length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Message is too long.",
      });
    }

    const visitorToken = createVisitorToken();

    const visitorTokenHash = hashVisitorToken(visitorToken);

    const conversation = await Conversation.create({
      visitorName: cleanName,

      visitorEmail: cleanEmail,

      subject: cleanSubject,

      visitorTokenHash,

      adminUnreadCount: 1,

      visitorUnreadCount: 0,

      lastMessageAt: new Date(),

      messages: [
        {
          sender: "visitor",
          body: cleanMessage,
        },
      ],
    });

    return res.status(201).json({
      success: true,

      message: "Conversation started successfully.",

      conversation: {
        id: conversation._id,

        visitorName: conversation.visitorName,

        visitorEmail: conversation.visitorEmail,

        subject: conversation.subject,

        status: conversation.status,

        messages: conversation.messages,

        createdAt: conversation.createdAt,
      },

      visitorToken,
    });
  } catch (error) {
    console.error("Create conversation error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to start the conversation. Please try again.",
    });
  }
});

/* =========================================================
   ADMIN — GET ALL CONVERSATIONS
========================================================= */

router.get("/admin", adminAuth, async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .sort({
        lastMessageAt: -1,
      })
      .select("-visitorTokenHash");

    return res.status(200).json({
      success: true,

      count: conversations.length,

      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load conversations.",
    });
  }
});

/* =========================================================
   PUBLIC — GET VISITOR CONVERSATION
========================================================= */

router.get("/:id", async (req, res) => {
  try {
    const visitorToken = getVisitorToken(req);

    const conversation = await verifyVisitorAccess(req.params.id, visitorToken);

    if (!conversation) {
      return res.status(401).json({
        success: false,

        message: "Conversation access denied.",
      });
    }

    if (conversation.visitorUnreadCount > 0) {
      conversation.visitorUnreadCount = 0;

      await conversation.save();
    }

    return res.status(200).json({
      success: true,

      conversation: {
        id: conversation._id,

        visitorName: conversation.visitorName,

        visitorEmail: conversation.visitorEmail,

        subject: conversation.subject,

        status: conversation.status,

        messages: conversation.messages,

        createdAt: conversation.createdAt,

        updatedAt: conversation.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get visitor conversation error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load conversation.",
    });
  }
});

/* =========================================================
   PUBLIC — VISITOR SENDS MESSAGE
========================================================= */

router.post("/:id/messages", conversationMessageLimiter, async (req, res) => {
  try {
    const visitorToken = getVisitorToken(req);

    const cleanMessage =
      typeof req.body.message === "string" ? req.body.message.trim() : "";

    if (!cleanMessage) {
      return res.status(400).json({
        success: false,

        message: "Message cannot be empty.",
      });
    }

    if (cleanMessage.length > 3000) {
      return res.status(400).json({
        success: false,

        message: "Message is too long.",
      });
    }

    const conversation = await verifyVisitorAccess(req.params.id, visitorToken);

    if (!conversation) {
      return res.status(401).json({
        success: false,

        message: "Conversation access denied.",
      });
    }

    if (conversation.status === "closed") {
      return res.status(400).json({
        success: false,

        message: "This conversation is closed.",
      });
    }

    conversation.messages.push({
      sender: "visitor",

      body: cleanMessage,
    });

    conversation.adminUnreadCount += 1;

    conversation.lastMessageAt = new Date();

    await conversation.save();

    return res.status(201).json({
      success: true,

      message: "Message sent.",

      conversation: {
        id: conversation._id,

        messages: conversation.messages,

        status: conversation.status,
      },
    });
  } catch (error) {
    console.error("Visitor reply error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to send message.",
    });
  }
});

/* =========================================================
   ADMIN — SEND REPLY
========================================================= */

router.post("/:id/admin-message", adminAuth, async (req, res) => {
  try {
    const cleanMessage =
      typeof req.body.message === "string" ? req.body.message.trim() : "";

    if (!cleanMessage) {
      return res.status(400).json({
        success: false,

        message: "Reply cannot be empty.",
      });
    }

    if (cleanMessage.length > 3000) {
      return res.status(400).json({
        success: false,

        message: "Reply is too long.",
      });
    }

    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        success: false,

        message: "Conversation not found.",
      });
    }

    if (conversation.status === "closed") {
      return res.status(400).json({
        success: false,

        message: "This conversation is closed.",
      });
    }

    conversation.messages.push({
      sender: "admin",

      body: cleanMessage,
    });

    conversation.visitorUnreadCount += 1;

    conversation.adminUnreadCount = 0;

    conversation.lastMessageAt = new Date();

    await conversation.save();

    return res.status(201).json({
      success: true,

      message: "Reply sent.",

      conversation,
    });
  } catch (error) {
    console.error("Admin reply error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to send reply.",
    });
  }
});

/* =========================================================
   ADMIN — MARK READ
========================================================= */

router.patch("/:id/admin-read", adminAuth, async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,

      {
        adminUnreadCount: 0,
      },

      {
        new: true,
      },
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,

        message: "Conversation not found.",
      });
    }

    return res.status(200).json({
      success: true,

      conversation,
    });
  } catch (error) {
    console.error("Mark conversation read error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to update conversation.",
    });
  }
});

/* =========================================================
   ADMIN — CLOSE / REOPEN
========================================================= */

router.patch("/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,

        message: "Invalid conversation status.",
      });
    }

    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,

      {
        status,
      },

      {
        new: true,
      },
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,

        message: "Conversation not found.",
      });
    }

    return res.status(200).json({
      success: true,

      conversation,
    });
  } catch (error) {
    console.error("Conversation status error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to update conversation status.",
    });
  }
});

/* =========================================================
   ADMIN — DELETE CONVERSATION
========================================================= */

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndDelete(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        success: false,

        message: "Conversation not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message: "Conversation deleted.",
    });
  } catch (error) {
    console.error("Delete conversation error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to delete conversation.",
    });
  }
});

export default router;
