const express = require("express");
const router = express.Router();
const scrapeController = require("../controllers/scrape");
const { authenticate } = require("../middleware/auth");


// Public routes

// Protected routes
router.post("/meta", authenticate, scrapeController.meta);
router.post("/contacts",  scrapeController.contacts)

module.exports = router;