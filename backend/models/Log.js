const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ["error", "warn", "info", "http", "debug"],
    required: true,
  },
  message: { type: String, required: true },
  meta: { type: mongoose.Schema.Types.Mixed },
  service: { type: String, default: "backend" },
  timestamp: { type: Date, default: Date.now },
});

// TTL: 3 gün sonra otomatik sil
logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 259200 });
// Sorgular için bileşik index
logSchema.index({ level: 1, timestamp: -1 });

module.exports = mongoose.model("Log", logSchema);
