const express = require("express");
const router = express.Router();
const offersController = require("../controllers/offerController");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.get("/", authenticate, offersController.index);
router.post("/", authenticate, offersController.create);

module.exports = router;

