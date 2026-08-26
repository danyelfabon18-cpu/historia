import express from "express";
import jwt from "jsonwebtoken";

import { adminLoginLimiter } from "../middleware/rateLimits.js";

const router = express.Router();

/* =========================================================
   ADMIN LOGIN
========================================================= */

router.post("/login", adminLoginLimiter, (req, res) => {
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
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Admin authentication is unavailable.",
      });
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

export default router;
