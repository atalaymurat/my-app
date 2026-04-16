const express = require("express");
const router = express.Router();
const optionsController = require("../controllers/optionsController");
const authenticate = require("../middleware/authenticate");
const superadminOnly = require("../middleware/superadminOnly");

// Public routes

// Protected routes
router.get("/", authenticate, superadminOnly, optionsController.index);
router.get("/list/:id", authenticate, superadminOnly, optionsController.list);
router.get("/make/:id", authenticate, superadminOnly, optionsController.make);
router.post("/", authenticate, superadminOnly, optionsController.create);
router.get("/:id", authenticate, superadminOnly, optionsController.show);
router.patch("/:id", authenticate, superadminOnly, optionsController.update);
router.delete("/:id", authenticate, superadminOnly, optionsController.destroy);

module.exports = router;
