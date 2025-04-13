const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { authenticate } = require('../middleware/auth');

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/user",authController.user);
router.get("/verify",authController.verify);

module.exports = router;
