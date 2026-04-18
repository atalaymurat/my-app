const express = require("express");
const router = express.Router();
const simpleOfferController = require("../controllers/simpleOfferController");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, simpleOfferController.create);

module.exports = router;
