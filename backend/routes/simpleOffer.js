const express = require("express");
const router = express.Router();
const simpleOfferController = require("../controllers/simpleOfferController");
const authenticate = require("../middleware/authenticate");
const { validateOfferPayload } = require("../middleware/validators");

router.post("/", authenticate, validateOfferPayload, simpleOfferController.create);

module.exports = router;
