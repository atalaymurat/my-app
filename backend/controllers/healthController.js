const mongoose = require("mongoose");

const SERVICES = [
  {
    name: "auth-service",
    url: `${process.env.AUTH_SERVICE_URL || "http://localhost:3022"}/health`,
  },
  {
    name: "pdf-service",
    url: `${process.env.PDF_SERVICE_URL || "http://localhost:3023"}/health`,
  },
];

const pingService = async ({ name, url }) => {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: { "x-internal-api-key": process.env.INTERNAL_API_KEY || "" },
    });
    return {
      name,
      status: res.ok ? "healthy" : "unhealthy",
      responseTime: Date.now() - start,
      lastChecked: new Date(),
    };
  } catch (err) {
    return {
      name,
      status: "unhealthy",
      responseTime: Date.now() - start,
      lastChecked: new Date(),
      error: err.message,
    };
  }
};

const getSystemInfo = () => {
  const mem = process.memoryUsage();
  return {
    name: "backend",
    status: mongoose.connection.readyState === 1 ? "healthy" : "unhealthy",
    responseTime: 0,
    lastChecked: new Date(),
    meta: {
      db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      memoryMB: Math.round(mem.rss / 1024 / 1024),
      uptime: Math.round(process.uptime()),
    },
  };
};

const check = async (req, res) => {
  try {
    const [serviceResults] = await Promise.all([
      Promise.all(SERVICES.map(pingService)),
    ]);

    const services = [getSystemInfo(), ...serviceResults];
    const allHealthy = services.every((s) => s.status === "healthy");

    res.json({
      success: true,
      allHealthy,
      services,
      timestamp: new Date(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { check };
