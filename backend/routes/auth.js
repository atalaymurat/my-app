const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { authenticate } = require("../middleware/auth");

// Public routes
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected routes
router.get("/user", authenticate, authController.user);
router.get("/verify", authenticate, authController.verify);

module.exports = router;
