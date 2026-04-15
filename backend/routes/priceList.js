const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/priceListController");
const authenticate = require("../middleware/authenticate");

router.get("/assigned", authenticate, ctrl.getAssignedPriceLists);
router.get("/", authenticate, ctrl.index);
router.post("/", authenticate, ctrl.create);
router.get("/:id", authenticate, ctrl.show);
router.patch("/:id", authenticate, ctrl.update);
router.delete("/:id", authenticate, ctrl.destroy);
router.patch("/:id/archive", authenticate, ctrl.archive);
router.get("/:id/snapshots", authenticate, ctrl.listSnapshots);
router.get("/:id/published", authenticate, ctrl.getPublishedSnapshot);
router.get("/:id/snapshot/active", authenticate, ctrl.getAssignedSnapshot);
router.post("/:id/snapshot", authenticate, ctrl.createSnapshot);
router.post("/:id/snapshot/clone", authenticate, ctrl.cloneSnapshot);
router.get("/:id/snapshot/:snapshotId", authenticate, ctrl.getSnapshot);
router.patch("/:id/snapshot/:snapshotId/items", authenticate, ctrl.updateSnapshotItems);
router.patch("/:id/snapshot/:snapshotId/publish", authenticate, ctrl.publishSnapshot);

module.exports = router;
