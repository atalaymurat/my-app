const express = require("express");
const router = express.Router();
const baseProductController = require("../controllers/baseProductController");
const { authenticate } = require("../middleware/auth");

// Public routes

// Protected routes
router.get("/", authenticate, baseProductController.index);
router.post("/", authenticate, baseProductController.create);

module.exports = router;