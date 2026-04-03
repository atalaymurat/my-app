const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyControl");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.get("/", authenticate, companyController.index);
router.post("/", authenticate, companyController.create);
router.get("/find", authenticate, companyController.search);
router.get("/:id", authenticate, companyController.show);
router.patch("/:id", authenticate, companyController.update);
router.delete("/:id", authenticate, companyController.destroy);

module.exports = router;
