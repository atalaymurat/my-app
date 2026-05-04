const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/priceListController");
const authenticate = require("../middleware/authenticate");
const superadminOnly = require("../middleware/superadminOnly");
const {
  validatePriceListAssignments,
  validatePriceListCreate,
  validatePriceListUpdate,
  validateSnapshotItems,
} = require("../middleware/validators");

// USER-OPEN — sadece authenticate
router.get("/assigned", authenticate, ctrl.getAssignedPriceLists);
router.get("/:id/snapshot/active", authenticate, ctrl.getAssignedSnapshot);

// SUPERADMIN-ONLY
router.get("/", authenticate, superadminOnly, ctrl.index);
router.post("/", authenticate, superadminOnly, validatePriceListCreate, ctrl.create);
router.get("/:id", authenticate, superadminOnly, ctrl.show);
router.patch("/:id", authenticate, superadminOnly, validatePriceListUpdate, ctrl.update);
router.delete("/:id", authenticate, superadminOnly, ctrl.destroy);
router.patch("/:id/archive", authenticate, superadminOnly, ctrl.archive);
router.patch("/:id/assignments", authenticate, superadminOnly, validatePriceListAssignments, ctrl.setAssignments);
router.get("/:id/snapshots", authenticate, superadminOnly, ctrl.listSnapshots);
router.get("/:id/published", authenticate, superadminOnly, ctrl.getPublishedSnapshot);
router.post("/:id/snapshot", authenticate, superadminOnly, ctrl.createSnapshot);
router.post("/:id/snapshot/clone", authenticate, superadminOnly, ctrl.cloneSnapshot);
router.get("/:id/snapshot/:snapshotId", authenticate, superadminOnly, ctrl.getSnapshot);
router.patch("/:id/snapshot/:snapshotId/items", authenticate, superadminOnly, validateSnapshotItems, ctrl.updateSnapshotItems);
router.patch("/:id/snapshot/:snapshotId/publish", authenticate, superadminOnly, ctrl.publishSnapshot);

module.exports = router;
