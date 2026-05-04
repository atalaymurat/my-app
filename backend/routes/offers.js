const express = require("express");
const router = express.Router();
const offersController = require("../controllers/offerController");
const simpleOfferController = require("../controllers/simpleOfferController");
const authenticate = require("../middleware/authenticate");
const { validateOfferPayload } = require("../middleware/validators");

// Public routes

// Protected routes
router.get("/", authenticate, offersController.index);
router.get("/:id", authenticate, offersController.show);
router.post("/", authenticate, validateOfferPayload, offersController.create);
router.patch("/:id/quick", authenticate, validateOfferPayload, simpleOfferController.update);
router.patch("/:id/status", authenticate, offersController.updateStatus);
router.patch("/:id/offer-terms", authenticate, validateOfferPayload, offersController.update);
router.delete("/:id", authenticate, offersController.destroy);

module.exports = router;

