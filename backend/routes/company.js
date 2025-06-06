const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyControl");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.get("/", authenticate, companyController.index);
router.post("/", authenticate, companyController.create);

module.exports = router;
