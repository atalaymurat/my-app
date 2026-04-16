const express = require("express");
const router = express.Router();
const makesController = require("../controllers/makesController");
const authenticate = require("../middleware/authenticate");
const superadminOnly = require("../middleware/superadminOnly");

// Public routes

// Protected routes
router.get("/", authenticate, superadminOnly, makesController.index);
router.post("/", authenticate, superadminOnly, makesController.create);
router.get("/:id", authenticate, superadminOnly, makesController.show);
router.patch("/:id", authenticate, superadminOnly, makesController.update);
router.delete("/:id", authenticate, superadminOnly, makesController.destroy);

module.exports = router;
