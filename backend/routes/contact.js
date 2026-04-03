const express = require("express");
const router = express.Router();
const contactsController = require("../controllers/contactsControl");
const authenticate = require("../middleware/authenticate");

// 🔓 Public routes
// (none defined yet, but can be added here in future)

// 🔐 Protected routes (authentication required)
router.get("/find", authenticate, contactsController.find);
router.get("/", authenticate, contactsController.index);
router.get("/:id", authenticate, contactsController.show); // List all contacts
router.post("/", authenticate, contactsController.create); // Create or find contact
router.patch("/:id", authenticate, contactsController.update); // Update contact
router.delete("/:id", authenticate, contactsController.destroy); // Delete contact

module.exports = router;
