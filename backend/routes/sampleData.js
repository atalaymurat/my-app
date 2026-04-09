const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const { createSampleData, deleteSampleData } = require("../services/sampleDataService");

// Internal endpoint — auth-service calls this after org creation
// Protected by INTERNAL_SERVICE_TOKEN
router.post("/init", async (req, res) => {
  try {
    const token = req.headers["x-service-token"];
    if (!token || token !== process.env.INTERNAL_SERVICE_TOKEN) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { organizationId, userId } = req.body;
    if (!organizationId || !userId) {
      return res.status(400).json({ error: "organizationId and userId required" });
    }

    await createSampleData(organizationId, userId);
    return res.json({ success: true });
  } catch (err) {
    console.error("Sample data init error:", err.message);
    return res.status(500).json({ error: "Sample data oluşturulamadı" });
  }
});

// User-facing: delete all sample data for the org
router.delete("/", authenticate, async (req, res) => {
  try {
    await deleteSampleData(req.user.orgId);
    return res.json({ success: true, message: "Örnek veriler silindi" });
  } catch (err) {
    console.error("Sample data delete error:", err.message);
    return res.status(500).json({ error: "Örnek veriler silinemedi" });
  }
});

module.exports = router;
