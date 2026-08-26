import express from "express";

import Message from "../models/Message.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* =========================================================
   PUBLIC — SEND MESSAGE
========================================================= */

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please complete all fields.",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: {
        id: newMessage._id,
      },
    });
  } catch (error) {
    console.error("Create message error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send your message.",
    });
  }
});

/* =========================================================
   ADMIN — GET ALL MESSAGES
========================================================= */

router.get("/", adminAuth, async (req, res) => {
  try {
    const messages = await Message.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve messages.",
    });
  }
});

/* =========================================================
   ADMIN — MARK AS READ
========================================================= */

router.patch("/:id/read", adminAuth, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        status: "read",
      },
      {
        new: true,
      },
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Update message error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update message.",
    });
  }
});

/* =========================================================
   ADMIN — DELETE MESSAGE
========================================================= */

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted.",
    });
  } catch (error) {
    console.error("Delete message error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete message.",
    });
  }
});

export default router;
