const express = require("express");
const router = express.Router();
const configurationController = require("../controllers/configurationControl");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.post("/", authenticate, configurationController.create);
router.get("/", authenticate, configurationController.index);

module.exports = router;

