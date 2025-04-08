// backend/index.js
require('dotenv') .config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { createSessionCookie, authMiddleware } = require("./firebaseAdmin");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "No ID token provided" });
    }

    // Create session cookie
    const expiresIn = 5 * 24 * 60 * 60 * 1000; // 5 days
    const sessionCookie = await createSessionCookie(idToken, expiresIn);

    // Set cookie options
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from 'strict' to 'lax' for better compatibility
      path: '/',
    };

    // Get user data to return immediately
    const decodedToken = await verifyIdToken(idToken) ;
    const userData = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name || decodedToken.email,
    };

    res.cookie("session", sessionCookie, options);
    res.status(200).json({ success: true, user: userData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
});



