const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdfController");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.get("/:id", pdfController.offerPdf);

module.exports = router;
