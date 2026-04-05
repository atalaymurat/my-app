const express = require("express");
const router = express.Router();
const masterProductController = require("../controllers/masterProductController");
const authenticate = require("../middleware/authenticate");

// Public routes

// Protected routes
router.get("/", authenticate, masterProductController.index);
router.get("/list", authenticate, masterProductController.list);
router.get("/offer", authenticate, masterProductController.offerList);
router.get("/options/:id", authenticate, masterProductController.optionsByMaster);
router.get("/masterbymake/:id", authenticate, masterProductController.masterByMake);
router.get("/byoption/:optionId", authenticate, masterProductController.byOption);
router.get("/make", authenticate, masterProductController.makeList);
router.post("/", authenticate, masterProductController.create);
router.get("/:id", authenticate, masterProductController.show);
router.put("/:id", authenticate, masterProductController.update);
router.delete("/:id", authenticate, masterProductController.destroy);

module.exports = router;
