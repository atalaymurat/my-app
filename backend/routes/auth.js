const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

// Public routes
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected routes
router.get("/user", authController.user);
router.get("/verify", authController.verify);

module.exports = router;
