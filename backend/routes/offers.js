const express = require("express");
const router = express.Router();
const offersController = require("../controllers/offerController");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.get("/", authenticate, offersController.index);
router.get("/:id", authenticate, offersController.show);
router.post("/", authenticate, offersController.create);
router.delete("/:id", authenticate, offersController.destroy);

module.exports = router;

