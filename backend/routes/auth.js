const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { loginLimiter, apiLimiter } = require("../middleware/rateLimit");
const User = require("../models/User");
const authenticate = require("shared-auth").authenticate(User);

// Public routes
router.post("/login", loginLimiter, authController.login);
router.post("/logout", authController.logout);

// Protected routes
router.get("/user", apiLimiter, authenticate, authController.user);

module.exports = router;
