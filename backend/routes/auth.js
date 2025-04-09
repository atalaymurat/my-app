const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { authMiddleware } = require("../firebaseAdmin");

router.post("/api/login", authController.login);
router.post("/api/logout", authController.logout);
router.get("/api/user-profile", authMiddleware, authController.userProfile);

module.exports = router;
