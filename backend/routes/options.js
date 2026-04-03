const express = require("express");
const router = express.Router();
const optionsController = require("../controllers/optionsController");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.get("/", authenticate, optionsController.index);
router.get("/list/:id", authenticate, optionsController.list);
router.get("/make/:id", authenticate, optionsController.make);
router.post("/", authenticate, optionsController.create);
router.get("/:id", authenticate, optionsController.show);
router.patch("/:id", authenticate, optionsController.update);
router.delete("/:id", authenticate, optionsController.destroy);

module.exports = router;

