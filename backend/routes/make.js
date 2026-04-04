const express = require("express");
const router = express.Router();
const makesController = require("../controllers/makesController");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.get("/", authenticate, makesController.index);
router.post("/", authenticate, makesController.create);

module.exports = router;
