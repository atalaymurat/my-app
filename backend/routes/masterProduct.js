const express = require("express");
const router = express.Router();
const masterProductController = require("../controllers/masterProductController");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.get("/", authenticate, masterProductController.index);
router.get("/list", authenticate, masterProductController.list);
router.get("/make", authenticate, masterProductController.makeList);
router.post("/", authenticate, masterProductController.create);

module.exports = router;
