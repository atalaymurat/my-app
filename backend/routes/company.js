const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyControl");
const User = require("../models/User");
const authenticate = require("shared-auth").authenticate(User);

// Public routes

// Protected routes
router.get("/", authenticate, companyController.index);
router.post("/", authenticate, companyController.create);

module.exports = router;