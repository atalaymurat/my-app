const express = require("express");
const router = express.Router();
const makesController = require("../controllers/makesController");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.get("/", authenticate, makesController.index);
router.post("/", authenticate, makesController.create);
router.get("/:id", authenticate, makesController.show);
router.patch("/:id", authenticate, makesController.update);
router.delete("/:id", authenticate, makesController.destroy);

module.exports = router;
