const express = require("express");
const router = express.Router();
const masterProductController = require("../controllers/masterProductController");
const authenticate = require("../middleware/authenticate");
const superadminOnly = require("../middleware/superadminOnly");

// Public routes

// Protected routes
router.get("/", authenticate, superadminOnly, masterProductController.index);
router.get("/list", authenticate, superadminOnly, masterProductController.list);
router.get("/offer", authenticate, superadminOnly, masterProductController.offerList);
router.get("/options/:id", authenticate, superadminOnly, masterProductController.optionsByMaster);
router.get("/masterbymake/:id", authenticate, superadminOnly, masterProductController.masterByMake);
router.get("/byoption/:optionId", authenticate, superadminOnly, masterProductController.byOption);
router.get("/make", authenticate, superadminOnly, masterProductController.makeList);
router.post("/", authenticate, superadminOnly, masterProductController.create);
router.get("/:id", authenticate, superadminOnly, masterProductController.show);
router.put("/:id", authenticate, superadminOnly, masterProductController.update);
router.delete("/:id", authenticate, superadminOnly, masterProductController.destroy);

module.exports = router;
