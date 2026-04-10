const router = require("express").Router();
const authenticate = require("../middleware/authenticate");
const adminOnly = require("../middleware/adminOnly");
const { index, stats, clear } = require("../controllers/logsController");
const Log = require("../models/Log");

// Internal: diğer servislerden log al (API key ile korunuyor)
router.post("/ingest", async (req, res) => {
  try {
    const apiKey = req.headers["x-internal-api-key"];
    if (apiKey !== process.env.INTERNAL_API_KEY) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { logs } = req.body;
    if (!Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({ error: "logs array required" });
    }

    const saved = await Log.insertMany(logs, { ordered: false });

    try {
      const { getIO } = require("../config/socket");
      const io = getIO();
      if (io.sockets.adapter.rooms.get("logs")?.size > 0) {
        io.to("logs").emit("new-log", saved.map((d) => d.toObject()));
      }
    } catch (_) {}

    res.json({ success: true, count: saved.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: dashboard endpoints
router.use(authenticate, adminOnly);
router.get("/stats", stats);
router.get("/", index);
router.delete("/", clear);

module.exports = router;
