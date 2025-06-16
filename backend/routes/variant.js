const express = require("express");
const router = express.Router();
const variantController = require("../controllers/productVariantControl");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.post("/", authenticate, variantController.create);
router.get("/", authenticate, variantController.index);

module.exports = router;

