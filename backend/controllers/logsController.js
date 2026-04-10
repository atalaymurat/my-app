const Log = require("../models/Log");

const index = async (req, res) => {
  try {
    const { service, level, startDate, endDate, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (service && service !== "all") query.service = service;
    if (level && level !== "all") query.level = level;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    if (search) query.message = { $regex: search, $options: "i" };

    const safeLimit = Math.min(parseInt(limit), 200);
    const skip = (parseInt(page) - 1) * safeLimit;

    const [logs, total] = await Promise.all([
      Log.find(query).sort({ timestamp: -1 }).skip(skip).limit(safeLimit).lean(),
      Log.countDocuments(query),
    ]);

    res.json({ logs, total, page: parseInt(page), totalPages: Math.ceil(total / safeLimit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const stats = async (req, res) => {
  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const collStats = await Log.collection.stats().catch(() => null);
    const sizeInMB = collStats ? (collStats.size / (1024 * 1024)).toFixed(2) : "N/A";

    const [counts24h, daily7d] = await Promise.all([
      Log.aggregate([
        { $match: { timestamp: { $gte: since24h } } },
        { $group: { _id: "$level", count: { $sum: 1 } } },
      ]),
      Log.aggregate([
        { $match: { timestamp: { $gte: since7d } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const byLevel = counts24h.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {});
    res.json({
      errors24h: byLevel.error || 0,
      warns24h: byLevel.warn || 0,
      info24h: byLevel.info || 0,
      total24h: counts24h.reduce((sum, { count }) => sum + count, 0),
      daily7d,
      collectionSize: sizeInMB,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const clear = async (req, res) => {
  try {
    if (!req.isSuperAdmin) return res.status(403).json({ error: "Sadece superadmin silebilir." });
    const { before } = req.query;
    const query = before ? { timestamp: { $lt: new Date(before) } } : {};
    const { deletedCount } = await Log.deleteMany(query);
    res.json({ deleted: deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { index, stats, clear };
