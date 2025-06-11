const express = require("express");
const router = express.Router();
const baseProductController = require("../controllers/baseProductController");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.get("/", authenticate, baseProductController.index);
router.get("/list", authenticate, baseProductController.list);
router.get("/make", authenticate, baseProductController.makeList);
router.post("/", authenticate, baseProductController.create);

module.exports = router;
