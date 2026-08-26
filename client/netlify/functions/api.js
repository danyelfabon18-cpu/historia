import crypto from "crypto";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import process from "node:process";
import serverless from "serverless-http";

/* =========================================================
   APP
========================================================= */

const app = express();
const router = express.Router();

app.use(
  express.json({
    limit: "20kb",
  }),
);

/* =========================================================
   DATABASE CONNECTION
========================================================= */

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
};

/* =========================================================
   CONVERSATION MODEL
========================================================= */

const conversationMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["visitor", "admin"],
      required: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  },
);

const conversationSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    visitorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    visitorTokenHash: {
      type: String,
      required: true,
      select: false,
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    adminUnreadCount: {
      type: Number,
      default: 1,
      min: 0,
    },

    visitorUnreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    messages: {
      type: [conversationMessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

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

/* =========================================================
   VISITOR ACCESS
========================================================= */

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
   ADMIN AUTH
========================================================= */

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Admin access required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    req.admin = decoded;

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session.",
    });
  }
};

/* =========================================================
   HEALTH CHECK
========================================================= */

router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Historia Netlify API is running.",
  });
});

/* =========================================================
   ADMIN LOGIN
========================================================= */

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    const validEmail = normalizedEmail === adminEmail;

    const validPassword = password === process.env.ADMIN_PASSWORD;

    if (!validEmail || !validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = jwt.sign(
      {
        role: "admin",
        email: normalizedEmail,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to sign in.",
    });
  }
});

/* =========================================================
   CREATE CONVERSATION
========================================================= */

router.post("/conversations", async (req, res) => {
  try {
    await connectToDatabase();

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
      message: "Unable to start the conversation.",
    });
  }
});

/* =========================================================
   ADMIN GET CONVERSATIONS
========================================================= */

router.get("/conversations/admin", adminAuth, async (req, res) => {
  try {
    await connectToDatabase();

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
   VISITOR GET CONVERSATION
========================================================= */

router.get("/conversations/:id", async (req, res) => {
  try {
    await connectToDatabase();

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
    console.error("Get conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load conversation.",
    });
  }
});

/* =========================================================
   VISITOR SEND MESSAGE
========================================================= */

router.post("/conversations/:id/messages", async (req, res) => {
  try {
    await connectToDatabase();

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
    console.error("Visitor message error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send message.",
    });
  }
});

/* =========================================================
   ADMIN SEND MESSAGE
========================================================= */

router.post("/conversations/:id/admin-message", adminAuth, async (req, res) => {
  try {
    await connectToDatabase();

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
   ADMIN MARK READ
========================================================= */

router.patch("/conversations/:id/admin-read", adminAuth, async (req, res) => {
  try {
    await connectToDatabase();

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
    console.error("Mark read error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update conversation.",
    });
  }
});

/* =========================================================
   ADMIN CLOSE / REOPEN
========================================================= */

router.patch("/conversations/:id/status", adminAuth, async (req, res) => {
  try {
    await connectToDatabase();

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
    console.error("Status update error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update conversation.",
    });
  }
});

/* =========================================================
   ADMIN DELETE
========================================================= */

router.delete("/conversations/:id", adminAuth, async (req, res) => {
  try {
    await connectToDatabase();

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

/* =========================================================
   ROUTER

   We mount both versions so the function works whether
   Netlify preserves /api in the rewritten path or strips it.
========================================================= */

app.use("/api", router);
app.use("/", router);

/* =========================================================
   404
========================================================= */

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

/* =========================================================
   NETLIFY HANDLER
========================================================= */

export const handler = serverless(app);
