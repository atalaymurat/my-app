const express = require("express");
const router = express.Router();
const optionsController = require("../controllers/optionsController");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.get("/", authenticate, optionsController.index);
router.get("/list/:id", authenticate, optionsController.list);
router.post("/", authenticate, optionsController.create);

module.exports = router;

