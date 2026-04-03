const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");
const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, statsController.summary);

module.exports = router;
