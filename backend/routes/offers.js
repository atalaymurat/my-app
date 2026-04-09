const express = require("express");
const router = express.Router();
const offersController = require("../controllers/offerController");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.get("/", authenticate, offersController.index);
router.get("/:id", authenticate, offersController.show);
router.post("/", authenticate, offersController.create);
router.patch("/:id/status", authenticate, offersController.updateStatus);
router.patch("/:id/offer-terms", authenticate, offersController.update);
router.delete("/:id", authenticate, offersController.destroy);

module.exports = router;

