const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyControl");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.get("/", authenticate, companyController.index);
router.post("/", authenticate, companyController.create);
router.get("/find", authenticate, companyController.search);

module.exports = router;
